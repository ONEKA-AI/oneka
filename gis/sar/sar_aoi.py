import argparse
import os
from pathlib import Path

import geopandas as gpd
import numpy as np
import rasterio
from rasterio.coords import disjoint_bounds
from rasterio.enums import Resampling
from rasterio.mask import mask
from rasterio.transform import from_gcps
from rasterio.vrt import WarpedVRT


def _find_measurement_folder(s1_path):
    path = Path(s1_path)
    if not path.exists():
        raise FileNotFoundError(f"S1 path not found: {s1_path}")

    # If path is already the SAFE folder, use its measurement folder directly.
    direct_measurement = path / "measurement"
    if direct_measurement.is_dir():
        return str(direct_measurement)

    # Otherwise, search under the provided root for the first measurement folder.
    for root, dirs, _ in os.walk(path):
        if "measurement" in dirs:
            return str(Path(root) / "measurement")

    raise FileNotFoundError(f"Could not find a Sentinel-1 'measurement' folder under: {s1_path}")


def _find_polarization_path(measurement_path, polarization):
    pol = polarization.lower()
    candidates = [
        os.path.join(measurement_path, name)
        for name in os.listdir(measurement_path)
        if name.lower().endswith(".tiff") and f"-{pol}-" in name.lower()
    ]
    if not candidates:
        raise FileNotFoundError(f"Could not find {polarization.upper()} TIFF in: {measurement_path}")
    return sorted(candidates)[0]


def _find_polarization_paths(measurement_path, polarization):
    pol = polarization.lower()
    candidates = [
        os.path.join(measurement_path, name)
        for name in os.listdir(measurement_path)
        if name.lower().endswith(".tiff") and f"-{pol}-" in name.lower()
    ]
    if not candidates:
        raise FileNotFoundError(f"Could not find {polarization.upper()} TIFF in: {measurement_path}")
    return sorted(candidates)


def _match_vh_for_vv(vv_path, vh_paths):
    vv_name = Path(vv_path).name
    expected_vh_name = vv_name.replace("-vv-", "-vh-")
    for vh_path in vh_paths:
        if Path(vh_path).name == expected_vh_name:
            return vh_path
    return vh_paths[0]


def _aoi_for_dataset(aoi, dataset, assumed_raster_crs):
    if dataset.crs is not None:
        return aoi.to_crs(dataset.crs), dataset.crs, None

    if aoi.crs is None:
        raise ValueError("AOI CRS is missing and VV raster CRS is also missing; cannot align coordinates.")

    if not assumed_raster_crs:
        return (
            aoi,
            None,
            "VV raster CRS is missing. AOI was not reprojected; overlap depends on already matching coordinates.",
        )

    assumed = rasterio.crs.CRS.from_string(assumed_raster_crs)
    return (
        aoi.to_crs(assumed),
        assumed,
        f"VV raster CRS is missing. Assumed raster CRS: {assumed.to_string()}",
    )


def _open_georeferenced(dataset):
    if dataset.crs is not None:
        return dataset, None

    gcps, gcps_crs = dataset.gcps
    if gcps and gcps_crs:
        gcps_transform = from_gcps(gcps)
        vrt = WarpedVRT(
            dataset,
            src_crs=gcps_crs,
            src_transform=gcps_transform,
            crs=gcps_crs,
            resampling=Resampling.nearest,
        )
        return vrt, f"Dataset CRS missing; used GCP georeferencing in {gcps_crs.to_string()}."

    return dataset, None


def _overlaps(dataset, aoi_same_crs):
    left, bottom, right, top = dataset.bounds
    ds_bounds = (
        min(left, right),
        min(bottom, top),
        max(left, right),
        max(bottom, top),
    )

    aoi_minx, aoi_miny, aoi_maxx, aoi_maxy = aoi_same_crs.total_bounds
    aoi_bounds = (
        min(aoi_minx, aoi_maxx),
        min(aoi_miny, aoi_maxy),
        max(aoi_minx, aoi_maxx),
        max(aoi_miny, aoi_maxy),
    )

    return not disjoint_bounds(ds_bounds, aoi_bounds)


def _to_db(masked_array, linear_scale_factor=10000.0):
    data = masked_array.data.astype(np.float32)
    sigma0 = data / linear_scale_factor
    valid = (~masked_array.mask) & (sigma0 > 0)
    out = np.full(data.shape, np.nan, dtype=np.float32)
    out[valid] = 10.0 * np.log10(sigma0[valid])
    return out


def _stats(values, label):
    if np.isnan(values).all():
        raise ValueError(f"No valid {label} pixels found inside the AOI.")
    return {
        "mean": float(np.nanmean(values)),
        "min": float(np.nanmin(values)),
        "max": float(np.nanmax(values)),
        "std": float(np.nanstd(values)),
    }


def _stats_masked_raw(masked_array, label):
    data = masked_array.data.astype(np.float32)
    valid = ~masked_array.mask
    values = np.full(data.shape, np.nan, dtype=np.float32)
    values[valid] = data[valid]
    return _stats(values, label)


def _append_warning(current, new_warning):
    if not new_warning:
        return current
    if not current:
        return new_warning
    parts = current.split(" | ")
    if new_warning in parts:
        return current
    return f"{current} | {new_warning}"


def compute_sar_vv_vh_from_safe(
    s1_path,
    geojson_path,
    assumed_raster_crs="EPSG:4326",
    linear_scale_factor=10000.0,
):
    aoi = gpd.read_file(geojson_path)
    measurement_path = _find_measurement_folder(s1_path)
    vv_candidates = _find_polarization_paths(measurement_path, "vv")
    vh_candidates = _find_polarization_paths(measurement_path, "vh")
    vv_path = None
    vh_path = None
    aoi_for_vv = None
    raster_crs_used = None
    warning = None

    for vv_candidate in vv_candidates:
        with rasterio.open(vv_candidate) as vv_src:
            vv_geo, geo_warning = _open_georeferenced(vv_src)
            try:
                aoi_candidate, crs_used, warning_candidate = _aoi_for_dataset(
                    aoi, vv_geo, assumed_raster_crs
                )
                if _overlaps(vv_geo, aoi_candidate):
                    vv_path = vv_candidate
                    vh_path = _match_vh_for_vv(vv_candidate, vh_candidates)
                    aoi_for_vv = aoi_candidate
                    raster_crs_used = crs_used
                    warnings = [w for w in [warning_candidate, geo_warning] if w]
                    warning = " | ".join(warnings) if warnings else None
                    break
            finally:
                if vv_geo is not vv_src:
                    vv_geo.close()

    if vv_path is None or vh_path is None:
        raise ValueError(
            "No VV measurement raster overlaps the AOI. Check AOI location, Sentinel-1 scene coverage, or CRS."
        )

    with rasterio.open(vv_path) as vv_src:
        vv_geo, vv_geo_warning = _open_georeferenced(vv_src)
        warning = _append_warning(warning, vv_geo_warning)
        try:
            vv_masked, _ = mask(vv_geo, aoi_for_vv.geometry, crop=True, filled=False)
        except ValueError as e:
            raise ValueError(
                f"AOI does not overlap VV raster after CRS alignment. "
                f"AOI CRS: {aoi_for_vv.crs}; VV CRS: {vv_geo.crs}; "
                f"AOI bounds: {tuple(aoi_for_vv.total_bounds)}; VV bounds: {vv_geo.bounds}"
            ) from e
        finally:
            if vv_geo is not vv_src:
                vv_geo.close()

    with rasterio.open(vh_path) as vh_src:
        vh_geo, vh_geo_warning = _open_georeferenced(vh_src)
        warning = _append_warning(warning, vh_geo_warning)
        aoi_for_vh = aoi_for_vv if vh_geo.crs == raster_crs_used else aoi.to_crs(vh_geo.crs)
        vh_masked, _ = mask(vh_geo, aoi_for_vh.geometry, crop=True, filled=False)
        if vh_geo is not vh_src:
            vh_geo.close()

    vv_band = vv_masked[0]
    vh_band = vh_masked[0]
    vv_db = _to_db(vv_band, linear_scale_factor=linear_scale_factor)
    vh_db = _to_db(vh_band, linear_scale_factor=linear_scale_factor)
    ratio_db = vv_db - vh_db

    return {
        "vv_db": _stats(vv_db, "VV"),
        "vh_db": _stats(vh_db, "VH"),
        "vv_minus_vh_db": _stats(ratio_db, "VV-VH"),
        "value_mode": "linear",
        "linear_scale_factor": linear_scale_factor,
        "vv_raw": _stats_masked_raw(vv_band, "VV raw"),
        "vh_raw": _stats_masked_raw(vh_band, "VH raw"),
        "measurement_path": measurement_path,
        "vv_path": vv_path,
        "vh_path": vh_path,
        "warning": warning,
    }


def compute_sar_from_safe(s1_path, geojson_path):
    return compute_sar_vv_vh_from_safe(s1_path, geojson_path)


def main():
    script_dir = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(
        description="Compute AOI Sentinel-1 SAR stats (VV dB, VH dB, VV-VH dB)."
    )
    parser.add_argument(
        "--safe-folder",
        default=r"C:\Bashscripts\Oneka-work-dir\GIS\Talanta 2025 s1",
        help="Path to a Sentinel-1 SAFE folder or a parent directory containing SAFE folders.",
    )
    parser.add_argument(
        "--aoi",
        default=str(script_dir.parent / "aoi" / "talanta.geojson"),
        help="Path to AOI GeoJSON (default: gis/aoi/talanta.geojson)",
    )
    parser.add_argument(
        "--assume-raster-crs",
        default="EPSG:4326",
        help=(
            "CRS to assume when Sentinel-1 measurement TIFF has no CRS "
            "(set to empty string to disable assumption)."
        ),
    )
    parser.add_argument(
        "--linear-scale-factor",
        type=float,
        default=10000.0,
        help="Linear SAR scale factor used before 10*log10 conversion (default: 10000).",
    )
    args = parser.parse_args()

    result = compute_sar_vv_vh_from_safe(
        args.safe_folder,
        args.aoi,
        assumed_raster_crs=args.assume_raster_crs or None,
        linear_scale_factor=args.linear_scale_factor,
    )
    print(result)


if __name__ == "__main__":
    main()

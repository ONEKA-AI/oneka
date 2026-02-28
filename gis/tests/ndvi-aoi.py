import argparse
import os
from pathlib import Path

import geopandas as gpd
import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.mask import mask
from rasterio.vrt import WarpedVRT


def _find_img_data_folder(safe_folder_path):
    for root, _, _ in os.walk(safe_folder_path):
        if Path(root).name.upper() == "IMG_DATA":
            return root
    raise FileNotFoundError(f"IMG_DATA folder not found under: {safe_folder_path}")


def _find_band_path(img_data_path, band_code):
    matches = [
        os.path.join(img_data_path, f)
        for f in os.listdir(img_data_path)
        if f.endswith(".jp2") and f"_{band_code}" in f
    ]
    if not matches:
        raise FileNotFoundError(f"Band {band_code} not found in: {img_data_path}")
    return sorted(matches)[0]


def _compute_index_stats(numerator, denominator, index_name):
    index = np.full(numerator.shape, np.nan, dtype=np.float32)
    valid = (~numerator.mask) & (~denominator.mask) & ((numerator.data + denominator.data) != 0)
    index[valid] = (numerator.data[valid] - denominator.data[valid]) / (
        numerator.data[valid] + denominator.data[valid]
    )

    if np.isnan(index).all():
        raise ValueError(f"No valid {index_name} pixels found inside the AOI.")

    return {
        "mean": float(np.nanmean(index)),
        "min": float(np.nanmin(index)),
        "max": float(np.nanmax(index)),
        "std": float(np.nanstd(index)),
    }


def compute_ndvi_ndwi_ndbi_from_safe(safe_folder_path, geojson_path):
    aoi = gpd.read_file(geojson_path)
    img_data_path = _find_img_data_folder(safe_folder_path)
    red_path = _find_band_path(img_data_path, "B04")
    nir_path = _find_band_path(img_data_path, "B08")
    green_path = _find_band_path(img_data_path, "B03")
    swir_path = _find_band_path(img_data_path, "B11")

    with rasterio.open(nir_path) as nir_src:
        aoi = aoi.to_crs(nir_src.crs)
        nir_masked, _ = mask(nir_src, aoi.geometry, crop=True, filled=False)

        with rasterio.open(red_path) as red_src:
            red_masked, _ = mask(red_src, aoi.geometry, crop=True, filled=False)

        with rasterio.open(green_path) as green_src:
            green_masked, _ = mask(green_src, aoi.geometry, crop=True, filled=False)

        with rasterio.open(swir_path) as swir_src:
            # B11 is 20m while B08 is 10m. Reproject SWIR to the NIR grid for valid NDBI math.
            with WarpedVRT(
                swir_src,
                crs=nir_src.crs,
                transform=nir_src.transform,
                width=nir_src.width,
                height=nir_src.height,
                resampling=Resampling.bilinear,
            ) as swir_on_nir_grid:
                swir_masked, _ = mask(swir_on_nir_grid, aoi.geometry, crop=True, filled=False)

    red = red_masked[0].astype(np.float32)
    nir = nir_masked[0].astype(np.float32)
    green = green_masked[0].astype(np.float32)
    swir = swir_masked[0].astype(np.float32)

    ndvi_stats = _compute_index_stats(nir, red, "NDVI")
    ndwi_stats = _compute_index_stats(green, nir, "NDWI")
    ndbi_stats = _compute_index_stats(swir, nir, "NDBI")

    return {
        "ndvi": ndvi_stats,
        "ndwi": ndwi_stats,
        "ndbi": ndbi_stats,
        "red_path": red_path,
        "nir_path": nir_path,
        "green_path": green_path,
        "swir_path": swir_path,
    }


def compute_ndvi_from_safe(safe_folder_path, geojson_path):
    return compute_ndvi_ndwi_ndbi_from_safe(safe_folder_path, geojson_path)


def main():
    script_dir = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(
        description="Compute AOI NDVI, NDWI, and NDBI stats from a Sentinel SAFE folder."
    )
    parser.add_argument(
        "--safe-folder",
        default=r"C:\Bashscripts\Oneka-work-dir\GIS\Talanta 2025",
        help="Path to the SAFE parent folder that contains GRANULE/.../IMG_DATA",
    )
    parser.add_argument(
        "--aoi",
        default=str(script_dir.parent / "aoi" / "talanta.geojson"),
        help="Path to AOI GeoJSON (default: gis/aoi/talanta.geojson)",
    )
    args = parser.parse_args()

    result = compute_ndvi_ndwi_ndbi_from_safe(args.safe_folder, args.aoi)
    print(result)


if __name__ == "__main__":
    main()

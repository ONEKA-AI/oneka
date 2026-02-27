import os
import argparse
from pathlib import Path

import pandas as pd

from optical_extractor import compute_optical_indices
from sar_extractor import compute_sar_indices


def _validate_s1_month_folder(month_path):
    entries = {p.name.lower(): p for p in month_path.iterdir() if p.is_file()}
    vv = [p for name, p in entries.items() if name.endswith((".tif", ".tiff")) and "vv" in name]
    vh = [p for name, p in entries.items() if name.endswith((".tif", ".tiff")) and "vh" in name]
    if not vv or not vh:
        raise FileNotFoundError(
            f"Invalid Sentinel-1 month folder '{month_path}'. Expected VV and VH TIFF files."
        )


def _validate_s2_month_folder(month_path):
    required = ["b03", "b04", "b08", "b11"]
    entries = [p.name.lower() for p in month_path.iterdir() if p.is_file()]
    missing = []
    for band in required:
        if not any(name.endswith((".tif", ".tiff", ".jp2")) and band in name for name in entries):
            missing.append(band.upper())
    if missing:
        raise FileNotFoundError(
            f"Invalid Sentinel-2 month folder '{month_path}'. Missing required bands: {', '.join(missing)}."
        )


def build_time_series(project_path, aoi_path=None):
    project_path = Path(project_path)
    s1_path = project_path / "sentinel1"
    s2_path = project_path / "sentinel2"
    if aoi_path is None:
        aoi_path = project_path / "aoi.geojson"
    aoi_path = Path(aoi_path)

    if not s1_path.is_dir():
        raise FileNotFoundError(f"Missing Sentinel-1 folder: {s1_path}")
    if not s2_path.is_dir():
        raise FileNotFoundError(f"Missing Sentinel-2 folder: {s2_path}")
    if not aoi_path.is_file():
        raise FileNotFoundError(f"Missing AOI file: {aoi_path}")

    months = sorted([name for name in os.listdir(s1_path) if (s1_path / name).is_dir()])
    rows = []

    for month in months:
        s1_month = s1_path / month
        s2_month = s2_path / month
        if not s2_month.is_dir():
            raise FileNotFoundError(f"Missing Sentinel-2 month folder for '{month}': {s2_month}")
        _validate_s1_month_folder(s1_month)
        _validate_s2_month_folder(s2_month)

        sar = compute_sar_indices(s1_month, aoi_path=aoi_path)
        optical = compute_optical_indices(s2_month, aoi_path=aoi_path)

        rows.append(
            {
                "month": month,
                "ndvi_mean": optical["ndvi"]["mean"],
                "ndwi_mean": optical["ndwi"]["mean"],
                "ndbi_mean": optical["ndbi"]["mean"],
                "vv_db_mean": sar["vv_db"]["mean"],
                "vh_db_mean": sar["vh_db"]["mean"],
                "vv_minus_vh_mean": sar["vv_minus_vh_db"]["mean"],
            }
        )

    df = pd.DataFrame(rows).sort_values("month")

    features_path = project_path / "features"
    features_path.mkdir(exist_ok=True)
    df.to_parquet(features_path / "features.parquet", index=False)

    return df


def main():
    parser = argparse.ArgumentParser(description="Build monthly SAR+optical feature table.")
    parser.add_argument(
        "--project-path",
        required=True,
        help="Project root containing sentinel1/<month> and sentinel2/<month> folders.",
    )
    parser.add_argument(
        "--aoi",
        default=None,
        help="Optional AOI GeoJSON path (default: gis/aoi/talanta.geojson).",
    )
    args = parser.parse_args()

    df = build_time_series(Path(args.project_path), aoi_path=args.aoi)
    print(df)
    print(f"Saved: {Path(args.project_path) / 'features' / 'features.parquet'}")


if __name__ == "__main__":
    main()

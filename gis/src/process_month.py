from pathlib import Path

from utils import clip_to_aoi, save_cog


def process_sentinel2_month(raw_band_paths, output_dir, aoi_path):
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    for band_name, band_path in raw_band_paths.items():
        clipped, profile = clip_to_aoi(band_path, aoi_path)
        save_cog(output_dir / f"{band_name}.tif", clipped, profile)


def process_sentinel1_month(vv_path, vh_path, output_dir, aoi_path):
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    vv_clip, vv_profile = clip_to_aoi(vv_path, aoi_path)
    save_cog(output_dir / "vv.tif", vv_clip, vv_profile)

    vh_clip, vh_profile = clip_to_aoi(vh_path, aoi_path)
    save_cog(output_dir / "vh.tif", vh_clip, vh_profile)


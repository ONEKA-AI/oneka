from pathlib import Path

import geopandas as gpd
import numpy as np
import rasterio
from rasterio.mask import mask


def clip_to_aoi(raster_path, aoi_path):
    aoi = gpd.read_file(aoi_path)
    with rasterio.open(raster_path) as src:
        aoi = aoi.to_crs(src.crs)
        clipped, transform = mask(src, aoi.geometry, crop=True, filled=True, nodata=src.nodata)
        profile = src.profile.copy()
        profile.update(
            {
                "height": clipped.shape[1],
                "width": clipped.shape[2],
                "transform": transform,
            }
        )
        if profile.get("nodata") is None:
            profile["nodata"] = np.nan
    return clipped, profile


def save_cog(output_path, array, profile):
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    cog_profile = profile.copy()
    cog_profile.update(
        {
            "driver": "GTiff",
            "tiled": True,
            "compress": "deflate",
            "blockxsize": 512,
            "blockysize": 512,
        }
    )

    with rasterio.open(output_path, "w", **cog_profile) as dst:
        dst.write(array)


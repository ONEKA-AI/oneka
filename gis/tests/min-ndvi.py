import rasterio
import numpy as np

# Paths to your bands
red_path = r"C:\Bashscripts\Oneka-work-dir\GIS\Talanta 2025\GRANULE\L1C_T37MBU_A004638_20250726T075926\IMG_DATA\T37MBU_20250726T073641_B04.jp2"
nir_path = r"C:\Bashscripts\Oneka-work-dir\GIS\Talanta 2025\GRANULE\L1C_T37MBU_A004638_20250726T075926\IMG_DATA\T37MBU_20250726T073641_B08.jp2"

with rasterio.open(red_path) as red:
    red_array = red.read(1).astype(float)

with rasterio.open(nir_path) as nir:
    nir_array = nir.read(1).astype(float)

# Avoid division by zero
np.seterr(divide='ignore', invalid='ignore')

ndvi = (nir_array - red_array) / (nir_array + red_array)

# Remove infinite values
ndvi = np.where(np.isfinite(ndvi), ndvi, np.nan)

mean_ndvi = np.nanmean(ndvi)

print("Mean NDVI:", mean_ndvi)

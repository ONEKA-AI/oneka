from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path


def _load_optical_module():
    module_path = Path(__file__).resolve().parents[1] / "optical" / "ndvi-aoi.py"
    spec = spec_from_file_location("optical_ndvi_aoi", module_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load optical module from: {module_path}")
    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def compute_optical_indices(safe_folder_path, aoi_path=None):
    module = _load_optical_module()
    if aoi_path is None:
        aoi_path = Path(__file__).resolve().parents[1] / "aoi" / "talanta.geojson"
    return module.compute_ndvi_ndwi_ndbi_from_safe(str(safe_folder_path), str(aoi_path))


export function disposeRecursive(obj) {
  if (obj) {
    obj.children.forEach(disposeRecursive);
    if (obj.geometry) {
      obj.geometry.dispose();
      obj.geometry = null;
    }
    if (obj.material) {
      if (obj.material.map) {
        obj.material.map.dispose();
        obj.material.map = null;
      }
      obj.material.dispose();
      obj.material = null;
    }
    obj = null;
  }
}

export function round(val, places) {
  const k = Math.pow(10, places);
  return Math.round(val * k) / k;
}

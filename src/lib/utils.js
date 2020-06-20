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

export function gaussianRandom(min, max) {
  // https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) num = gaussianRandom(min, max);
  return num * (max - min) + min;
}

export function guassianNoiseIf(condition, n) {
  if (condition) return gaussianRandom(-n, n);
  return 0;
}

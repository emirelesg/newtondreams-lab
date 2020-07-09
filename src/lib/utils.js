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

export function filterObj(obj, test) {
  if (!obj || typeof obj !== 'object') return {};
  return Object.entries(obj).reduce((acc, [key, obj]) => {
    if (test(obj)) return { ...acc, [key]: obj };
    return acc;
  }, {});
}

export function simulateProjectileMotion({ v0, theta, x0, y0, noise, dt }) {
  // Array where all results will be stored.
  let signals = [];

  // Time.
  let t = 0; // Current time in seconds.
  let tOffset = 0; // Time shift for motion equations in seconds.
  let tShifted = 0; // Result of t - tOffset
  let tFinal = 0; // Time at which the ball reaches the ground.

  // Position.
  let y = 0;
  let x = 0;

  // Speeds.
  let vx0 = v0 * Math.cos((theta * Math.PI) / 180);
  let vy = vy0;
  let vy0 = v0 * Math.sin((theta * Math.PI) / 180);

  // Bounces.
  let bounces = 0;

  // Calculate until ball has bounced n times or more than 5 seconds have elapsed.
  // The last one is a safety feature to avoid infinte loops.
  while (bounces < 7 && t < 5) {
    // Calculate current time.
    tShifted = t - tOffset;

    // Motion equation for -x and -y.
    y = y0 + vy0 * tShifted - 0.5 * 9.81 * tShifted * tShifted;
    x = x0 + vx0 * tShifted;
    vy = vy0 - 9.81 * tShifted;

    // If ball has reached the ground.
    if (y < 0) {
      // Goal is to bounce ball and calculate where the ball will be after the bounce in the
      // next sample time.

      // Calculate the flight time of the current ball.
      tFinal = (vy0 + Math.sqrt(vy0 * vy0 + 2 * 9.81 * y0)) / 9.81;

      // After first bounce, ball starts at y = 0.
      y0 = 0;

      // The next bounce is shifted by the time it took the previous bounce.
      tOffset += tFinal;

      // The ball is -x shifted by the amount it traveled in the preivous bounce.
      x0 += vx0 * tFinal;

      // New -y speed is the final speed when reaching the ground multiplied
      // by a constant.
      vy0 = (vy0 - 9.81 * tFinal) * -0.6;
      vx0 *= 0.6;

      // Increase the number of bounces
      bounces += 1;
    } else {
      // If the ball is flying then add point to list and continue time.
      signals.push({
        t: round(t, 2),
        x: round(x + guassianNoiseIf(noise, 0.005), 4),
        y: round(y + guassianNoiseIf(noise, 0.005), 4),
        vx: round(vx0 + guassianNoiseIf(noise, 0.005), 4),
        vy: round(vy + guassianNoiseIf(noise, 0.005), 4)
      });
      t += dt;
    }
  }

  return signals;
}

export function constain(val, min, max) {
  if (val > max) return max;
  if (val < min) return min;
  return val;
}

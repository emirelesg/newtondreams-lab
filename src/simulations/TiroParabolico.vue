<template>
  <div ref="parent" class="full">
    <sim-header
      title="Tiro Parabólico"
      description="Determina el ángulo de lanzamiento con mayor alcance."
    >
    </sim-header>
    <sim-controls @input="handleControls"></sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import ProjectileSystem from '@/lib/elements/ProjectileSystem.js';
import { state } from '@/store/index.js';
import { guassianNoiseIf, round } from '@/lib/utils.js';

const signals = {
  t: {
    name: 'Tiempo',
    units: 's',
    isTime: true
  },
  x: {
    name: 'Posición -X',
    units: 'm'
  },
  y: {
    name: 'Posición -Y',
    units: 'm'
  }
};
const controls = {
  angle: {
    type: 'slider',
    label: 'Inclinación',
    min: 0,
    max: 90,
    step: 5,
    value: 30,
    suffix: '°'
  }
};

export default {
  name: 'TiroParabolico',
  mixins: [SimMixin],
  components: {
    SimHeader,
    SimControls
  },
  data: () => ({
    model: null
  }),
  methods: {
    setup() {
      this.model = new ProjectileSystem();
      this.app.scene.add(this.model);
      return this.model.load();
    },
    reset() {
      this.setAnimationData(this.simulate(1 / 60, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
      if (this.model && this.model.loaded) {
        this.model.setInclination(state.sim.settings.angle.value);
        this.model.setPath(this.animation);
      }
    },
    draw(frame, i) {
      if (frame && this.model && this.model.loaded) {
        const { x, y } = frame;
        this.model.projectile.position.set(x * 100, y * 100, 0);
        this.model.setPathDisplayLimit(i);
      }
    },
    simulate(dt, noise) {
      // The velocity in m/s.
      const v = 2;

      // Calculate the components of the velocity.
      const theta = (state.sim.settings.angle.value * Math.PI) / 180;
      let vx0 = v * Math.cos(theta);
      let vy0 = v * Math.sin(theta);

      // Time in seconds.
      let t = 0;

      // Counts the amount of bounces.
      let bounces = 0;

      // Initial -x and -y position.
      let x0 = 0;
      let y0 = 0.0525;

      // Current -x and -y position.
      let x = 0;
      let y = 0;

      // Motion function are shifted in time by this value.
      let off = 0;

      // Array of signals.
      let signals = [];

      // Calculate until ball has bounced n times or more than 5 seconds have elapsed.
      // The last one is a safety feature to avoid infinte loops.
      while (bounces < 7 && t < 5) {
        // Motion equation for -x and -y.
        y = y0 + vy0 * (t - off) - 0.5 * 9.81 * Math.pow(t - off, 2);
        x = x0 + vx0 * (t - off);

        // If ball has reached the ground.
        if (y < 0) {
          // Goal is to bounce ball and calculate where the ball will be after the bounce in the
          // next sample time.

          // Calculate the flight time of the current ball.
          let tfinal = (vy0 + Math.sqrt(vy0 * vy0 + 2 * 9.81 * y0)) / 9.81;

          // After first bounce, ball starts at y = 0.
          y0 = 0;

          // The next bounce is shifted by the time it took the previous bounce.
          off += tfinal;

          // The ball is -x shifted by the amount it traveled in the preivous bounce.
          x0 += vx0 * tfinal;

          // Speeds are reduced by 75%.
          vx0 *= 0.6;
          vy0 *= 0.6;

          // Increase the number of bounces
          bounces += 1;
        } else {
          // If the ball is flying then add point to list and continue time.
          signals.push({
            t: round(t, 2),
            x: round(x + guassianNoiseIf(noise, 0.005), 4),
            y: round(y + guassianNoiseIf(noise, 0.005), 4)
          });
          t += dt;
        }
      }

      return signals;
    }
  },
  mounted() {
    this.init(['start'], ['settings', 'data', 'graph'], signals, controls);
  },
  beforeDestroy() {
    if (this.model) this.model.destroy();
    this.model = null;
    this.destroy();
  }
};
</script>

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
import { simulateProjectileMotion } from '@/lib/utils.js';

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
    max: 85,
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
      const simOpts = {
        v0: 2,
        theta: state.sim.settings.angle.value,
        x0: 0,
        y0: 0.0525
      };
      this.setAnimationData(
        simulateProjectileMotion({ ...simOpts, noise: false, dt: 1 / 60 })
      );
      this.setSimulationData(
        simulateProjectileMotion({
          ...simOpts,
          noise: true,
          dt: state.sim.sampleTime
        })
      );
      this.model.setInclination(state.sim.settings.angle.value);
      this.model.setPath(this.animation);
    },
    draw(frame, i) {
      if (frame && this.model && this.model.loaded) {
        const { x, y } = frame;
        this.model.projectile.position.set(x * 100, y * 100, 0);
        this.model.setPathDisplayLimit(i);
      }
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

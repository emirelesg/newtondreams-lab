<template>
  <div ref="parent" class="full">
    <sim-header
      title="Energía"
      description="Calcula la energía cinética y potencial del balín de plomo."
    >
    </sim-header>
    <sim-controls @input="handleControls"></sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import FreeFallSystem from '@/lib/elements/FreeFallSystem.js';
import { state } from '@/store/index.js';
import { simulateProjectileMotion } from '@/lib/utils.js';

const signals = {
  t: {
    name: 'Tiempo',
    units: 's',
    isTime: true
  },
  y: {
    name: 'Altura',
    units: 'm'
  },
  vy: {
    name: 'Velocidad',
    units: 'm/s'
  }
};
const controls = {
  height: {
    type: 'slider',
    label: 'Altura',
    min: 5,
    max: 45,
    step: 5,
    value: 20,
    suffix: 'cm'
  },
  mass: {
    type: 'slider',
    label: 'Masa',
    min: 50,
    max: 100,
    step: 10,
    value: 100,
    suffix: 'g'
  }
};

export default {
  name: 'Energia',
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
      this.model = new FreeFallSystem();
      this.app.scene.add(this.model);
      this.app.scene.position.y = -10;
      return this.model.load();
    },
    reset() {
      // Use the mass of the projectile to calculate its radius.
      // Sphere volume: (4 / 3) * PI * r^3
      // Density = mass / volume
      // Lead density: 11.34 g / cm^3
      this.model.setProjectileRadius(
        Math.pow(
          state.sim.settings.mass.value / ((4 / 3) * Math.PI * 11.34),
          1 / 3
        )
      );
      const simOpts = {
        v0: 0,
        theta: 0,
        x0: 0,
        y0: state.sim.settings.height.value / 100
      };
      this.setAnimationData(
        simulateProjectileMotion({ ...simOpts, noise: false, dt: 1 / 50 })
      );
      this.setSimulationData(
        simulateProjectileMotion({
          ...simOpts,
          noise: true,
          dt: state.sim.sampleTime
        })
      );
      this.model.updateHeight(state.sim.settings.height.value);
    },
    draw(frame, i) {
      if (frame && this.model && this.model.loaded) {
        const { x, y } = frame;
        this.model.projectile.position.y = y * 100 + 1.5;
        this.model.projectile.position.x = x * 100;
        // Open gripper in the first 5 frames.
        this.model.gripperOpenPercent(i < 5 ? i / 5 : 1);
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

<template>
  <div ref="parent" class="full">
    <sim-header
      title="Péndulo Simple"
      description="Determina la aceleración debida a la gravedad."
      note="El péndulo sólo oscilará durante 4 segundos."
    >
    </sim-header>
    <sim-controls @input="handleControls"></sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import PendulumSystem from '@/lib/elements/PendulumSystem.js';
import { state } from '@/store/index.js';
import { round, guassianNoiseIf } from '@/lib/utils.js';

const signals = {
  t: {
    name: 'Tiempo',
    units: 's',
    isTime: true
  },
  angle: {
    name: 'Ángulo',
    units: '°'
  }
};
const controls = {
  length: {
    type: 'slider',
    label: 'Longitud',
    min: 10,
    max: 40,
    step: 5,
    value: 30,
    suffix: 'cm'
  },
  angle: {
    type: 'slider',
    label: 'Ángulo',
    min: -10,
    max: 10,
    step: 1,
    value: 7,
    suffix: '°'
  }
};

export default {
  name: 'PenduloSimple',
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
      this.model = new PendulumSystem();
      this.app.scene.add(this.model);
      this.app.scene.position.y = -10;
      return this.model.load();
    },
    reset() {
      this.model.setHeight(state.sim.settings.length.value);
      this.setAnimationData(this.simulate(1 / 50, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
    },
    draw(frame) {
      if (frame && this.model && this.model.loaded) {
        const { angle } = frame;
        this.model.rod.rotation.z = (angle * Math.PI) / 180;
      }
    },
    simulate(dt, noise) {
      let omega = Math.sqrt(9.81 / (state.sim.settings.length.value / 100));
      let angle0 = (state.sim.settings.angle.value * Math.PI) / 180;
      let angle = 0;
      let signals = [];
      for (let t = 0; t <= 4; t += dt) {
        angle = angle0 * Math.cos(omega * t);
        signals.push({
          t: round(t, 2),
          angle: round(
            (angle * 180) / Math.PI + guassianNoiseIf(noise, 0.25),
            4
          )
        });
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

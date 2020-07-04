<template>
  <div ref="parent" class="full">
    <sim-header
      title="Movimiento Rectilíneo Acelerado"
      description="Analiza un vehículo con aceleración constante."
    >
    </sim-header>
    <sim-controls @input="handleControls"></sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import { state } from '@/store/index';
import { round, guassianNoiseIf } from '@/lib/utils';
import RailSystemWithPulley from '@/lib/elements/RailSystemWithPulley';
import colors from 'vuetify/lib/util/colors';

const signals = {
  t: {
    name: 'Tiempo',
    units: 's',
    isTime: true
  },
  x: {
    name: 'Posición',
    units: 'm'
  },
  v: {
    name: 'Velocidad',
    units: 'm/s'
  },
  a: {
    name: 'Aceleración',
    units: 'm/s²'
  }
};
const controls = {};

export default {
  name: 'MovimientoRectilineoAcelerado',
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
      if (this.model) this.model.destroy();
      this.model = new RailSystemWithPulley();
      this.app.scene.add(this.model);
      this.model.position.y = 10;
      this.app.floor.position.y = -40;
      return this.model.load();
    },
    reset() {
      this.model.setCarColor(colors.green.lighten1);
      this.setAnimationData(this.simulate(1 / 50, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
    },
    draw(frame) {
      if (frame && this.model && this.model.loaded) {
        const { x } = frame;
        this.model.car.position.x = -37 + x * 100;
        this.model.weight.position.y = -2 - (x - 0.02) * 100;
        this.model.updatePulley();
      }
    },
    simulate(dt, noise) {
      let x = 0.02;
      let a = 1;
      let v = 0;
      let t = 0;
      let signals = [];
      const maxX =
        (Math.abs(this.model.position.y) +
          Math.abs(this.app.floor.position.y)) /
        100;
      do {
        signals.push({
          t: round(t, 2),
          x: round(x + guassianNoiseIf(noise, 0.003), 4),
          v: round(v + guassianNoiseIf(noise, 0.003), 4),
          a: round(a + guassianNoiseIf(noise, 0.003), 4)
        });
        v += a * dt;
        x += v * dt;
        t += dt;
      } while (x <= maxX);
      return signals;
    }
  },
  mounted() {
    this.init(['start'], ['graph', 'data'], signals, controls);
  },
  beforeDestroy() {
    if (this.model) this.model.destroy();
    this.model = null;
    this.destroy();
  }
};
</script>

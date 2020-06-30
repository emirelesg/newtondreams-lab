<template>
  <div ref="parent" class="full">
    <sim-header
      title="Movimiento Rectilíneo Uniforme"
      description="Analiza un vehículo con velocidad constante."
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
import RailSystem from '@/lib/elements/RailSystem';

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
    units: 'm/s^2'
  }
};

export default {
  name: 'MovimientoRectilíneoUniforme',
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
      this.model = new RailSystem();
      this.app.scene.add(this.model);
      return this.model.load();
    },
    reset() {
      this.setAnimationData(this.simulate(1 / 50, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
    },
    draw(frame) {
      if (frame && this.model && this.model.loaded) {
        const { x } = frame;
        this.model.car.position.x = -37 + x * 100;
      }
    },
    simulate(dt, noise) {
      let x = 0.02;
      let a = 0;
      let v = 1;
      let t = 0;
      let signals = [];
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
      } while (x <= 0.85);
      return signals;
    }
  },
  mounted() {
    this.init(['start'], ['graph', 'data'], signals, {});
  },
  beforeDestroy() {
    if (this.model) this.model.destroy();
    this.model = null;
    this.destroy();
  }
};
</script>

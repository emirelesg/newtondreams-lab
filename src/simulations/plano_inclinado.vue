<template>
  <div ref="parent" class="full">
    <sim-header
      title="Plano Inclinado"
      description="Analiza el movimiento en un vehiculo en un plano inclinado."
    ></sim-header>
  </div>
</template>

<script>
import SimHeader from '@/components/SimHeader.vue';
import SimMixin from '@/components/SimMixin.js';
import { state } from '@/store/index';
import { round, guassianNoiseIf } from '@/lib/utils';
import RailSystem from '@/lib/elements/RailSystem';

const signals = [
  {
    name: 'Tiempo',
    var: 't',
    units: 's',
    isTime: true
  },
  {
    name: 'Posición',
    var: 'x',
    units: 'm'
  },
  {
    name: 'Velocidad',
    var: 'v',
    units: 'm/s'
  },
  {
    name: 'Aceleración',
    var: 'a',
    units: 'm/s^2'
  }
];

const controls = {
  angle: {
    type: 'slider',
    label: 'Inclinación',
    min: 0,
    max: 20,
    step: 1,
    value: 10,
    suffix: '°'
  }
};

export default {
  name: 'PlanoInclinado',
  mixins: [SimMixin],
  components: {
    SimHeader
  },
  data: () => ({
    model: null
  }),
  methods: {
    setup() {
      if (this.model) this.model.destroy();
      this.model = new RailSystem();
      this.app.scene.add(this.model);
    },
    reset() {
      this.model.setInclination(-this.settings.angle.value);
      this.setAnimationData(this.simulate(1 / 50, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
    },
    draw(frame) {
      if (frame && this.model.car) {
        const { x } = frame;
        this.model.car.position.x = -37 + x * 100;
      }
    },
    simulate(dt, noise) {
      const theta = (this.settings.angle.value * Math.PI) / 180;
      const sinx = Math.sin(theta);
      const cosx = Math.cos(theta);
      const g = 9.81;
      const uk = 0.1;
      let x = 0.02;
      const a = g * (sinx - uk * cosx);
      let v = 0;
      let t = 0;
      let signals = [];
      while (x <= 0.85) {
        signals.push({
          t: round(t, 2),
          x: round(x + guassianNoiseIf(noise, 0.003), 4),
          v: round(v + guassianNoiseIf(noise, 0.003), 4),
          a: round(a + guassianNoiseIf(noise, 0.003), 4)
        });
        if (a <= 0) break;
        v += a * dt;
        x += v * dt;
        t += dt;
      }
      return signals;
    }
  },
  mounted() {
    this.init(['start'], ['graph', 'data', 'settings'], signals, controls);
  },
  beforeDestroy() {
    if (this.model) this.model.destroy();
    this.model = null;
    this.destroy();
  },
  computed: {
    settings: () => state.sim.settings
  }
};
</script>

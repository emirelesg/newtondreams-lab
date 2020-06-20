<template>
  <div ref="parent" class="full">
    <sim-header
      title="Plano Inclinado"
      description="Analiza el movimiento en un vehiculo en un plano inclinado."
    >
    </sim-header>
  </div>
</template>

<script>
import SimHeader from '@/components/SimHeader.vue';
import { state, mutations } from '@/store/index';
import App from '@/lib/index';
import RailSystem from '@/lib/elements/RailSystem';
import { round, guassianNoiseIf } from '@/lib/utils';

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
    min: 5,
    max: 20,
    step: 1,
    value: 10,
    suffix: '°'
  }
  // mass: {
  //   type: 'slider',
  //   label: 'Masa',
  //   min: 0.1,
  //   max: 1,
  //   step: 0.1,
  //   value: 0.1,
  //   suffix: 'kg'
  // }
};

export default {
  name: 'PlanoInclinado',
  components: {
    SimHeader
  },
  data: () => ({
    app: null,
    box: null,
    animation: [],
    i: 0
  }),
  methods: {
    setup() {
      this.app = new App(this.$refs.parent, {});
      this.model = new RailSystem();
      this.app.scene.add(this.model);
      this.app.renderer.setAnimationLoop(this.draw.bind(this));
    },
    reset() {
      this.model.setInclination(-this.controls.angle.value);
      this.i = 0;
      this.animation = this.simulate(1 / 50, false);
      mutations.setSimData(this.simulate(state.sim.sampleTime, true));
    },
    draw() {
      const { t, x } = this.animation[this.i];
      if (this.model.car) {
        this.model.car.position.x = -37 + x * 100;
      }
      if (state.sim.isRunning) {
        mutations.updateSimDisplayLimit(t);
        if (this.i < this.animation.length - 1) {
          this.i += 1;
        } else {
          mutations.stopSim();
        }
      }
      this.app.controls.update(this.app.camera);
      this.app.renderer.render(this.app.scene, this.app.camera);
    },
    simulate(dt, noise) {
      const theta = (this.controls.angle.value * Math.PI) / 180;
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
    state.bus.$on('reset', this.reset);
    this.$nextTick(() => {
      mutations.setEnabledControls(['start']);
      mutations.setEnabledWindows(['graph', 'data', 'settings']);
      mutations.setSimSignals(signals);
      mutations.setSimControls(controls);
      this.setup();
      mutations.resetSim();
    });
  },
  computed: {
    controls: () => state.sim.controls
  },
  beforeDestroy() {
    this.model.destroy();
    this.app.destroy();
    this.model = null;
    this.app = null;
    state.bus.$off('reset', this.reset);
  }
};
</script>

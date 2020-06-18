<template>
  <div ref="parent" id="scene"></div>
</template>

<script>
import { state, mutations } from '@/store/index';
import App from '@/lib/index';
import Rail from '@/lib/elements/RailSystem';
import { round } from '@/lib/utils';

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
    units: 'cm'
  },
  {
    name: 'Velocidad',
    var: 'v',
    units: 'cm/s'
  },
  {
    name: 'Aceleración',
    var: 'a',
    units: 'cm/s^2'
  }
];

export default {
  name: 'PlanoInclinado',
  components: {},
  data: () => ({
    app: null,
    box: null,
    animation: [],
    i: 0
  }),
  watch: {},
  methods: {
    setup() {
      this.app = new App(this.$refs.parent, {});
      this.model = new Rail();
      this.app.scene.add(this.model);
      this.app.renderer.setAnimationLoop(this.draw.bind(this));
    },
    reset() {
      this.i = 0;
      this.animation = this.simulate(1 / 60, false);
      mutations.setSimData(this.simulate(state.sim.sampleTime, true));
    },
    draw() {
      const { t, x } = this.animation[this.i];
      if (this.model.car) {
        this.model.car.position.x = -37 + x;
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
      const v0 = 100;
      const x0 = 2;
      let x = x0;
      let v = v0;
      let t = 0;
      let signals = [];
      while (x <= 85) {
        let noiseX = noise ? 0.1 * (Math.random() * 6 - 3) : 0;
        let noiseV = noise ? 0.1 * (Math.random() * 6 - 3) : 0;
        signals.push({
          t: round(t, 2),
          x: round(x + noiseX, 2),
          v: round(v + noiseV, 2),
          a: 0
        });
        x += v * dt;
        t += dt;
      }
      return signals;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setup();
      mutations.setSimSignals(signals);
      mutations.resetSim();
    });
    state.bus.$on('reset', this.reset);
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

<style scoped>
#scene {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

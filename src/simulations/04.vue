<template>
  <div ref="parent" id="scene"></div>
</template>

<script>
import { state, mutations } from '@/store/index';
import App from '@/lib/index';

const signals = [];

export default {
  name: 'Sim3',
  components: {},
  data: () => ({
    app: null
  }),
  watch: {},
  methods: {
    setup() {
      this.app = new App(this.$refs.parent, {});
      this.app.renderer.setAnimationLoop(this.draw.bind(this));
    },
    reset() {},
    draw() {
      this.app.controls.update();
      this.app.renderer.render(this.app.scene, this.app.camera);
    },
    simulate() {}
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
    this.app.destroy();
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

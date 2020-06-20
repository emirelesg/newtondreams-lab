<template>
  <div ref="parent" class="full">
    <sim-header
      title="Mediciones"
      description="Mide los objectos haciendo clic sobre dos vertices."
    >
      <div class="primary--text font-weight-bold">
        {{ getDistance() }}
      </div>
    </sim-header>
  </div>
</template>

<script>
import SimHeader from '@/components/SimHeader.vue';
import { state, mutations } from '@/store/index';
import BasicShapes from '@/lib/elements/BasicShapes';
import { round, gaussianRandom } from '@/lib/utils';
import App from '@/lib/index';

export default {
  name: 'Mediciones',
  components: {
    SimHeader
  },
  data: () => ({
    app: null,
    model: null
  }),
  watch: {},
  methods: {
    setup() {
      this.app = new App(this.$refs.parent, {});
      this.model = new BasicShapes(this.app);
      this.app.scene.add(this.model);
      this.app.renderer.setAnimationLoop(this.draw.bind(this));
    },
    reset() {},
    draw() {
      this.app.controls.update();
      this.app.renderer.render(this.app.scene, this.app.camera);
    },
    simulate() {},
    getDistance() {
      if (this.model && this.model.distance) {
        return `${round(
          this.model.distance + gaussianRandom(-0.2, 0.2),
          2
        )} cm`;
      }
      return `-`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      // mutations.resetSim();
      mutations.setEnabledControls([]);
      mutations.setEnabledWindows(['data']);
      this.setup();
      this.reset();
    });
    state.bus.$on('reset', this.reset);
  },
  beforeDestroy() {
    this.model.destroy();
    this.app.destroy();
    this.app = null;
    this.model = null;
    state.bus.$off('reset', this.reset);
  }
};
</script>

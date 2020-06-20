import App from '@/lib/index';
import { state, mutations } from '@/store/index';
export default {
  data: () => ({
    app: null,
    _step: 0,
    _animation: []
  }),
  methods: {
    init(enabledControls, enabledWindows, signals, settings) {
      this.$nextTick(() => {
        this.setAnimationData([]);
        mutations.setEnabledWindows(enabledWindows);
        mutations.setSimSignals(signals);
        mutations.setSimSettings(settings);
        state.bus.$on('reset', this._reset);
        this._setup();
        this.setup();
        mutations.resetSim();
        mutations.setEnabledControls(enabledControls);
      });
    },
    setSimulationData(data) {
      mutations.setSimData(data);
    },
    setAnimationData(animation) {
      this._step = 0;
      this._animation = animation;
    },
    destroy() {
      state.bus.$off('reset', this._reset);
      if (this.app) this.app.destroy();
      this.app = null;
    },
    _setup() {
      if (this.app) this.app.destroy();
      this.app = new App(this.$refs.parent, {});
      this.app.renderer.setAnimationLoop(this._draw.bind(this));
    },
    _reset() {
      if (this.reset) this.reset();
    },
    _draw() {
      if (this.draw) {
        if (this._animation.length > 0) {
          this.draw(this._animation[this._step]);
        } else {
          this.draw();
        }
      }
      if (state.sim.isRunning) {
        mutations.updateSimDisplayLimit(this._animation[this._step].t);
        if (this._step < this._animation.length - 1) {
          this._step += 1;
        } else {
          mutations.stopSim();
        }
      }
      this.app.controls.update(this.app.camera);
      this.app.renderer.render(this.app.scene, this.app.camera);
    }
  }
};

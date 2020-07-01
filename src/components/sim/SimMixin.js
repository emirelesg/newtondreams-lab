import App from '@/lib/index';
import { state, mutations } from '@/store/index';
export default {
  data: () => ({
    app: null,
    _step: 0,
    animation: []
  }),
  methods: {
    init(enabledControls, enabledWindows, signals, settings) {
      this.$nextTick(async () => {
        this.setAnimationData([]);
        mutations.setEnabledWindows(enabledWindows);
        mutations.setSimSignals(signals);
        mutations.setSimSettings(settings);
        this._setup();
        await this.setup();
        state.bus.$on('reset', this._reset);
        mutations.resetSim();
        mutations.setEnabledControls(enabledControls);
      });
    },
    setSimulationData(data) {
      mutations.setSimData(data);
    },
    setAnimationData(animation) {
      this._step = 0;
      this.animation = animation;
    },
    handleControls(action) {
      if (this.app) {
        this.app.handleControls(action);
      }
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
        if (this.animation.length > 0) {
          this.draw(this.animation[this._step], this._step);
        } else {
          this.draw();
        }
      }
      if (state.sim.isRunning) {
        mutations.updateSimDisplayLimit(this.animation[this._step].t);
        if (this._step < this.animation.length - 1) {
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

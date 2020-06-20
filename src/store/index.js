import Vue from 'vue';

export const state = Vue.observable({
  token: localStorage.getItem('device'),
  renderer: null,
  navDrawer: false,
  activeWindow: null,
  sim: {
    sampleTime: null,
    signals: [],
    data: [],
    displayLimit: 0,
    isRunning: false,
    settings: {}
  },
  controls: {
    start: false,
    reset: false
  },
  windows: {
    data: false,
    graph: false,
    settings: false
  },
  snackbar: {
    message: null,
    color: null
  },
  bus: new Vue()
});

export const getters = {
  isAuthenticated: () => !!state.token
};

export const mutations = {
  // Set snackbar state.
  setSnackbarMessage: (message, color) => {
    state.snackbar.message = message;
    state.snackbar.color = color;
  },
  // Set auth state.
  setToken: token => {
    localStorage.setItem('device', token);
    state.token = token;
  },
  clearToken: () => {
    localStorage.removeItem('device');
    state.token = null;
  },
  // Set app state.
  setRenderer: renderer => {
    state.renderer = renderer;
  },
  setNavDrawer: val => {
    state.navDrawer = val;
  },
  toggleNavDrawer: () => {
    state.navDrawer = !state.navDrawer;
  },
  setActiveWindow: win => {
    state.activeWindow = win;
  },
  setEnabledControls: controls => {
    Object.keys(state.controls).forEach(c => {
      state.controls[c] = controls.indexOf(c) !== -1;
    });
  },
  setEnabledWindows: windows => {
    Object.keys(state.windows).forEach(w => {
      state.windows[w] = windows.indexOf(w) !== -1;
    });
  },
  // Following mutations have to do with the simulation.
  setSimSignals: signals => {
    state.sim.signals = signals || [];
  },
  setSimSettings: settings => {
    state.sim.settings = settings || {};
  },
  setSimSampleTime: dt => {
    state.sim.sampleTime = dt;
  },
  setSimData: data => {
    state.sim.data = data || [];
  },
  updateSimDisplayLimit: t => {
    state.sim.displayLimit = Math.floor(t / state.sim.sampleTime);
  },
  startSim: () => {
    state.sim.isRunning = true;
    state.controls.reset = true;
    state.controls.start = false;
  },
  stopSim: () => {
    state.sim.isRunning = false;
    state.sim.displayLimit = state.sim.data.length;
  },
  resetSim: () => {
    state.sim.isRunning = false;
    state.controls.reset = false;
    state.controls.start = true;
    state.sim.data = [];
    state.sim.displayLimit = 0;
    state.bus.$emit('reset');
  }
};

export const actions = {
  authenticate: password => {
    if (password === 'udem') {
      const token = Array(36)
        .fill()
        .map(() =>
          '0123456789abcdef'.substr(Math.floor(Math.random() * 0x10), 1)
        )
        .join('');
      mutations.setToken(token);
      return true;
    }
    return false;
  },
  cleanup: (to, from, next) => {
    // Router guard called before entering a simulations.
    // Here is the configuration of values that should only be
    // set once.
    mutations.setActiveWindow(null);
    mutations.setSimSampleTime(1 / 50);

    // Must first clear the limit. That way for loops that rely on this
    // do not count up. Then clear data and signals.
    mutations.updateSimDisplayLimit(0);
    mutations.setSimData(null);
    mutations.setSimSignals(null);
    mutations.setSimSettings(null);
    mutations.stopSim();

    // Clear enabled controls and windows.
    mutations.setEnabledControls([]);
    mutations.setEnabledWindows([]);

    // Since all windows use 'keep-alive' signal them to
    // reset their respective properties.
    state.bus.$emit('resetWindow');
    next();
  }
};

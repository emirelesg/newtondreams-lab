import Vue from 'vue';

export const state = Vue.observable({
  token: localStorage.getItem('device'),
  renderer: null,
  navDrawer: false,
  activeWindow: null
});

export const getters = {
  isAuthenticated: () => !!state.token
};

export const mutations = {
  setToken: token => {
    localStorage.setItem('device', token);
    state.token = token;
  },
  clearToken: () => {
    localStorage.removeItem('device');
    state.token = null;
  },
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
  }
};

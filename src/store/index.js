import Vue from 'vue';

export const state = Vue.observable({
  token: localStorage.getItem('device')
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

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: true
  },
  mutations: {},
  actions: {},
  modules: {},
  getters: {
    isAuthenticated: state => !!state.token
  }
});

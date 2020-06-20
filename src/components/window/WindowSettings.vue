<template>
  <window-base title="Ajustes">
    <v-row dense>
      <v-col cols="12" v-for="key in controlKeys" :key="key">
        <setting-slider
          :conf="controls[key]"
          @input="val => set(key, val)"
          v-if="controls[key].type === 'slider'"
        ></setting-slider>
      </v-col>
    </v-row>
  </window-base>
</template>

<script>
import { state, mutations } from '@/store/index';
import SettingSlider from '@/components/window/SettingSlider.vue';
import WindowBase from '@/components/window/WindowBase.vue';
export default {
  name: 'WindowSettings',
  components: {
    WindowBase,
    SettingSlider
  },
  data: () => ({
    slider: 10,
    timeout: null
  }),
  watch: {},
  methods: {
    set(key, val) {
      this.controls[key].value = val;
      this.resetDebounced();
    },
    resetDebounced() {
      if (this.timeout) {
        cancelAnimationFrame(this.timeout);
      }
      this.timeout = requestAnimationFrame(mutations.resetSim);
    }
  },
  activated() {},
  deactivated() {},
  computed: {
    controls: () => state.sim.controls,
    controlKeys: () => Object.keys(state.sim.controls)
  }
};
</script>

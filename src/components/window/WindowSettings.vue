<template>
  <window-base title="Ajustes">
    <v-row dense>
      <v-col cols="12" v-for="key in settingKeys" :key="key">
        <setting-slider
          :conf="settings[key]"
          @input="val => set(key, val)"
          v-if="settings[key].type === 'slider'"
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
      this.settings[key].value = val;
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
    settings: () => state.sim.settings,
    settingKeys: () => Object.keys(state.sim.settings)
  }
};
</script>

<template>
  <div class="window-switcher">
    <v-btn
      :disabled="!enabled[window.key]"
      text
      v-for="(window, i) in windows"
      :key="window.name"
      @click="onWindowChange(i)"
      :color="i === active ? 'primary' : 'secondary'"
    >
      <v-icon>{{ window.icon }}</v-icon>
      <span>{{ window.name }}</span>
    </v-btn>
  </div>
</template>

<script>
import { state, mutations } from '@/store/index';

export default {
  name: 'WindowSwitcher',
  data: () => ({
    windows: [
      {
        name: 'Datos',
        key: 'data',
        icon: 'mdi-table-large'
      },
      {
        name: 'Gráficas',
        key: 'graph',
        icon: 'mdi-chart-line'
      },
      {
        name: 'Ajustes',
        key: 'settings',
        icon: 'mdi-cog'
      }
    ]
  }),
  methods: {
    onWindowChange(windowIdx) {
      mutations.setActiveWindow(this.active === windowIdx ? null : windowIdx);
    }
  },
  computed: {
    active: () => state.activeWindow,
    enabled: () => state.windows
  }
};
</script>

<style scoped>
.window-switcher {
  height: 100%;
}
</style>

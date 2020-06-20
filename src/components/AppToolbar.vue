<template>
  <v-sheet tile class="toolbar background border-bottom">
    <div class="toolbar-container">
      <v-btn :disabled="!controls.start" text color="green" @click="startSim">
        <v-icon>mdi-play</v-icon>
        <span>Simular</span>
      </v-btn>
      <v-btn text :disabled="!controls.reset" color="primary" @click="resetSim">
        <v-icon>mdi-refresh</v-icon>
        <span>Reconfigurar</span>
      </v-btn>
      <v-divider class="mx-4" vertical></v-divider>
      <window-switcher></window-switcher>
      <v-spacer></v-spacer>
    </div>
  </v-sheet>
</template>

<script>
import { state, mutations } from '@/store/index';
import WindowSwitcher from '@/components/window/WindowSwitcher';

export default {
  name: 'AppToolbar',
  components: {
    WindowSwitcher
  },
  data: () => ({}),
  methods: {
    startSim: mutations.startSim,
    resetSim: mutations.resetSim
  },
  computed: {
    controls: () => state.controls
  }
};
</script>

<style scoped>
.toolbar {
  height: 56px;
}

.toolbar-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.toolbar-container >>> button {
  height: 100% !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border-radius: 0;
  text-transform: none;
}

.toolbar-container >>> button:disabled {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

.toolbar-container >>> button .v-btn__content span {
  font-size: 0.75rem;
}

.toolbar-container >>> button .v-btn__content i {
  margin-right: 15px;
}

@media only screen and (max-width: 600px) {
  .toolbar-container >>> button .v-btn__content i {
    margin-right: 0px;
  }

  .toolbar-container >>> button .v-btn__content span {
    display: none;
  }
}
</style>

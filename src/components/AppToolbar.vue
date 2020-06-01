<template>
  <v-sheet tile class="toolbar background border-bottom">
    <div class="toolbar-container">
      <v-btn color="green--text">
        <v-icon>mdi-play</v-icon>
        <span>Simular</span>
      </v-btn>
      <v-divider class="mx-4" vertical></v-divider>
      <window-switcher></window-switcher>
      <v-spacer></v-spacer>
    </div>
  </v-sheet>
</template>

<script>
import WindowSwitcher from '@/components/window/WindowSwitcher';

export default {
  name: 'AppToolbar',
  components: {
    WindowSwitcher
  },
  data: () => ({})
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
  justify-content: left;
}

.toolbar-container >>> button {
  height: 100% !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border-radius: 0;
  text-transform: none;
}

.toolbar-container >>> button .v-btn__content span {
  font-size: 0.75rem;
}

.toolbar-container >>> button .v-btn__content i {
  margin-right: 15px;
}
</style>

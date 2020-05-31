<template>
  <v-sheet class="toolbar">
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
  background-color: #f5f7fa !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-width: thin;
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
  color: rgba(0, 0, 0, 0.6);
}

.toolbar-container >>> button .v-btn__content span {
  font-size: 0.75rem;
}

.toolbar-container >>> button .v-btn__content i {
  margin-right: 15px;
}
</style>

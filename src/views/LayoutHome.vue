<template>
  <v-app class="app">
    <app-navigation></app-navigation>
    <app-header></app-header>
    <app-snackbar></app-snackbar>
    <v-content>
      <v-sheet tile class="full-screen">
        <app-toolbar></app-toolbar>
        <div class="fill-height">
          <window-wrapper></window-wrapper>
          <router-view></router-view>
        </div>
      </v-sheet>
    </v-content>
  </v-app>
</template>

<script>
import AppToolbar from '@/components/AppToolbar.vue';
import AppSnackbar from '@/components/AppSnackbar.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppNavigation from '@/components/AppNavigation.vue';
import WindowWrapper from '@/components/window/WindowWrapper.vue';

export default {
  name: 'LayoutMain',
  components: {
    AppToolbar,
    AppHeader,
    AppNavigation,
    AppSnackbar,
    WindowWrapper
  },
  data: () => ({})
};
</script>

<style scoped>
.full-screen {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.full-screen .fill-height {
  position: relative;
  overflow: hidden;
}
</style>

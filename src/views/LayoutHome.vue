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
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import AppToolbar from '@/components/AppToolbar';
import AppFooter from '@/components/AppFooter';
import AppSnackbar from '@/components/AppSnackbar';
import AppHeader from '@/components/AppHeader';
import AppNavigation from '@/components/AppNavigation';
import WindowWrapper from '@/components/window/WindowWrapper';

export default {
  name: 'LayoutMain',
  components: {
    AppToolbar,
    AppFooter,
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
}
</style>

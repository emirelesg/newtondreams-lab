<template>
  <v-app-bar color="primary" dark app clipped-left fixed elevation="0">
    <v-app-bar-nav-icon @click.stop="toggleNavDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>NewtonDreams <strong>Lab</strong></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn dark icon @click="signOut">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
    <a
      target="_blank"
      href="https://udem.edu.mx/es"
      v-if="$vuetify.breakpoint.smAndUp"
      class="ml-1"
    >
      <v-img alt="Logo UDEM" width="62" contain src="@/assets/LogoUdem.png" />
    </a>
  </v-app-bar>
</template>

<script>
import { mutations } from '@/store/index';

export default {
  name: 'AppHeader',
  data: () => ({}),
  methods: {
    toggleNavDrawer: mutations.toggleNavDrawer,
    signOut() {
      mutations.clearToken();
      this.$router.push({ name: 'sign-in' });
    }
  }
};
</script>

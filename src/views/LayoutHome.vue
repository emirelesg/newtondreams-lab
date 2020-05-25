<template>
  <v-app class="app">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item-group active-class="primary--text">
          <v-list-item link :to="lab.path" v-for="lab in labs" :key="lab.path">
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular">
                {{ lab.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="primary" dark app clipped-left fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>NewtonDreams <strong>Lab</strong></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn dark icon @click="signOut">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <a
        target="_blank"
        href="https://udem.edu.mx/es"
        v-if="$vuetify.breakpoint.smAndUp"
      >
        <v-img alt="Logo UDEM" width="62" contain src="@/assets/LogoUdem.png" />
      </a>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer app class="secondary--text grey lighten-3 caption ">
      <span>
        Universidad de Monterrey &copy; 2014 -
        {{ new Date().getFullYear() }}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import { mutations } from '@/store/index';
import { labs } from '@/router';

export default {
  name: 'LayoutMain',
  data: () => ({
    drawer: null,
    labs
  }),
  methods: {
    signOut() {
      mutations.clearToken();
      this.$router.push({ name: 'sign-in' });
    }
  }
};
</script>

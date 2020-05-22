<template>
  <v-app class="app">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link v-for="i in 30" :key="i">
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular"
              >Dashboard</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="primary" dark app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>NewtonDreams <strong>Lab</strong></v-toolbar-title>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer app class="secondary--text grey lighten-3 caption ">
      <span>
        Universidad de Monterrey &copy; {{ new Date().getFullYear() }}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'LayoutMain',
  data: () => ({
    drawer: null
  })
};
</script>

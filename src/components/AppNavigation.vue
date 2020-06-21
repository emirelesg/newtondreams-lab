<template>
  <v-navigation-drawer @input="setNavDrawer" :value="navDrawer" app clipped>
    <v-list dense>
      <v-list-item-group active-class="primary--text">
        <v-list-item
          link
          :to="lab.path"
          v-for="(lab, i) in labs"
          :key="lab.path"
        >
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular">
              {{ i + 1 }}. {{ lab.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <app-footer></app-footer>
  </v-navigation-drawer>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue';
import { mutations, state } from '@/store/index';
import { labs } from '@/router';

export default {
  name: 'AppNavigation',
  components: {
    AppFooter
  },
  data: () => ({
    labs
  }),
  methods: {
    setNavDrawer: mutations.setNavDrawer
  },
  computed: {
    navDrawer: () => state.navDrawer
  }
};
</script>

<style scoped>
.v-list-item--active .v-list-item__title {
  font-weight: 500 !important;
}
</style>

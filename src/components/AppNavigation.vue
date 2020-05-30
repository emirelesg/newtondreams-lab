<template>
  <v-navigation-drawer @input="setDrawer" :value="drawer" app clipped>
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
  </v-navigation-drawer>
</template>

<script>
import { mutations, state } from '@/store/index';
import { labs } from '@/router';

export default {
  name: 'AppNavigation',
  data: () => ({
    labs
  }),
  methods: {
    setDrawer: mutations.setDrawer
  },
  computed: {
    drawer: () => state.drawer
  }
};
</script>

<style scoped>
.v-list-item--active .v-list-item__title {
  font-weight: 500 !important;
}
</style>

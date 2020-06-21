<template>
  <v-card flat class="border window-card">
    <v-card-title class="">
      <span class="font-weight-regular">{{ title }}</span>
      <v-spacer></v-spacer>
      <v-btn icon color="secondary" @click="close">
        <v-icon size="20">mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
import { mutations } from '@/store/index';

export default {
  name: 'WindowBase',
  props: {
    title: { require: true, type: String }
  },
  data: () => ({}),
  methods: {
    close() {
      mutations.setActiveWindow(null);
    }
  }
};
</script>

<style scoped>
.window-card {
  height: 100%;
  overflow-y: scroll;
}
</style>

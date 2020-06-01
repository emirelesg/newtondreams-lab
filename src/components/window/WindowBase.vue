<template>
  <v-card elevation="7">
    <v-card-title>
      <span class="headline">{{ title }}</span>
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

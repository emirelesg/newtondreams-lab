<template>
  <div class="sim-controls d-flex">
    <v-btn fab small class="secondary--text" @click="zoomIn">
      <v-icon>mdi-magnify-plus-outline</v-icon>
    </v-btn>
    <v-btn fab small class="secondary--text" @click="zoomOut">
      <v-icon>mdi-magnify-minus-outline</v-icon>
    </v-btn>
    <v-btn fab small class="secondary--text" @click="home">
      <v-icon>mdi-home</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'SimControls',
  data: () => ({}),
  methods: {
    zoomIn() {
      this.$emit('input', 'zoomIn');
    },
    zoomOut() {
      this.$emit('input', 'zoomOut');
    },
    home() {
      this.$emit('input', 'home');
    }
  }
};
</script>

<style scoped>
.sim-controls {
  flex-direction: column;
  position: absolute;
  bottom: 32px;
  right: 32px;
}

.sim-controls button:not(:first-child) {
  margin-top: 12px;
}
</style>

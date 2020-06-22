<template>
  <div class="sim-controls d-flex">
    <v-btn fab small class="mb-3 secondary--text">
      <v-icon>mdi-magnify-plus-outline</v-icon>
    </v-btn>
    <v-btn fab small class="mb-3 secondary--text">
      <v-icon>mdi-magnify-minus-outline</v-icon>
    </v-btn>
    <v-btn fab small class="secondary--text">
      <v-icon>mdi-home</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'SimControls'
};
</script>

<style scoped>
.sim-controls {
  flex-direction: column;
  position: absolute;
  bottom: 32px;
  right: 32px;
}
</style>

<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  data: () => ({})
};
</script>

<style>
html,
body {
  /* height: 100%; */
}
html {
  /* Remove scroll bar https://github.com/vuetifyjs/vuetify/issues/864 */
  overflow-y: auto !important;
}
.v-application--wrap {
  /* min-height: inherit !important; */
}
.app {
  height: 100%;
  background: #efefef !important;
}
canvas {
  background-color: #ffffff;
}
.full-screen {
  position: absolute;
  user-select: none;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

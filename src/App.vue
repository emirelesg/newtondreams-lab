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
  outline: none;
}
</style>

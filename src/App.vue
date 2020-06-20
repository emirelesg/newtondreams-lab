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

.background {
  background-color: #f5f7fa !important;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-width: thin;
}
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-width: thin;
}
.border {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-width: thin;
}
.full {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

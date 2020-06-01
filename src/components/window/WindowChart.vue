<template>
  <window-base title="Gráfica">
    <div class="wrapper">
      <div class="var-y"><signal-selector></signal-selector></div>
      <div class="chart"></div>
    </div>
    <div class="var-x"><signal-selector></signal-selector></div>
  </window-base>
</template>

<script>
import WindowBase from '@/components/window/WindowBase';
import SignalSelector from '@/components/window/SignalSelector';

export default {
  name: 'WindowChart',
  components: {
    WindowBase,
    SignalSelector
  },
  data: () => ({})
};
</script>

<style scoped>
.chart {
  background-color: lavender;
  height: 300px;
  width: 100%;
}
.var-x {
  padding-left: 36px;
  padding-top: 8px;
  display: flex;
  justify-content: center;
}
.wrapper {
  position: relative;
  padding-left: 36px;
}
.wrapper .var-y {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 28px;
  overflow: hidden;
  white-space: nowrap;
}
.wrapper .var-y >>> button {
  transform-origin: 0 50%;
  transform: rotate(-90deg) translate(-50%, 50%);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>

<template>
  <window-base title="Gráfica">
    <div class="wrapper">
      <div class="var-y">
        <signal-selector
          v-model="varY"
          :signals="otherSignals"
        ></signal-selector>
      </div>
      <div class="chart"></div>
    </div>
    <div class="var-x">
      <signal-selector v-model="varX" :signals="timeSignals"></signal-selector>
    </div>
  </window-base>
</template>

<script>
import { state } from '@/store/index';
import WindowBase from '@/components/window/WindowBase';
import SignalSelector from '@/components/window/SignalSelector';

export default {
  name: 'WindowChart',
  components: {
    WindowBase,
    SignalSelector
  },
  data: () => ({
    varX: null,
    varY: null
  }),
  watch: {
    varX() {
      this.reset();
    },
    varY() {
      this.reset();
    }
  },
  methods: {
    reset() {
      if (this.varX === null || this.varY === null) return;
      const x = this.timeSignals[this.varX];
      const y = this.otherSignals[this.varY];
      x;
      y;
    }
  },
  mounted() {
    this.reset();
  },
  computed: {
    timeSignals: () => state.sim.signals.filter(s => s.isTime),
    otherSignals: () => state.sim.signals.filter(s => !s.isTime),
    datapoints: () => state.sim.data,
    limit: () => state.sim.displayLimit
  }
};
</script>

<style scoped>
.chart {
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

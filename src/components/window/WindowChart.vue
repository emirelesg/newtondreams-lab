<template>
  <window-base title="Gráfica">
    <div class="wrapper">
      <div class="var-y">
        <signal-selector
          v-model="varY"
          :signals="otherSignals"
        ></signal-selector>
      </div>
      <chart
        ref="chart"
        :chart-data="data"
        :styles="style"
        :options="options"
      ></chart>
    </div>
    <div class="var-x">
      <signal-selector v-model="varX" :signals="timeSignals"></signal-selector>
    </div>
  </window-base>
</template>

<script>
import { state } from '@/store/index';
import Chart from '@/components/charts/BaseChart';
import WindowBase from '@/components/window/WindowBase';
import SignalSelector from '@/components/window/SignalSelector';

export default {
  name: 'WindowChart',
  components: {
    WindowBase,
    Chart,
    SignalSelector
  },
  data: () => ({
    style: {
      height: '300px',
      width: '100%'
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        enabled: true,
        callbacks: {}
      },
      elements: {
        point: {
          pointStyle: 'circle',
          radius: 2
        },
        line: {
          tension: 0
        }
      },
      scales: {
        xAxes: [{}],
        yAxes: [{}]
      }
    },
    data: {
      labels: [],
      datasets: [
        {
          label: 'y',
          type: 'line',
          borderWidth: 2,
          borderDash: [0, 0],
          pointHitRadius: 10,
          pointHoverRadius: 4,
          data: [],
          backgroundColor: 'rgba(0, 0, 0, 0)'
        }
      ]
    },
    varX: null,
    varY: null,
    xValues: [],
    yValues: []
  }),
  watch: {
    varX() {
      this.init();
    },
    varY() {
      this.init();
    },
    datapoints() {
      this.init();
    },
    limit() {
      this.update();
    }
  },
  methods: {
    update() {
      this.data.datasets[0].data = this.yValues.slice(0, this.limit);
      this.$refs.chart.update();
    },
    init() {
      // Set dataset color to match the primary color.
      this.$refs.chart.color(0, this.$vuetify.theme.themes.light.primary);

      // Get x values from datapoints.
      if (this.timeSignals[this.varX]) {
        const x = this.timeSignals[this.varX];
        this.xValues = this.datapoints.map(point => point[x.var]);
        this.$refs.chart.xUnits(x.units);
      } else {
        this.xValues = [];
      }
      this.data.labels = this.xValues;

      // Get y values from datapoints and set -y limits.
      if (this.otherSignals[this.varY]) {
        const y = this.otherSignals[this.varY];
        this.yValues = this.datapoints.map(point => point[y.var]);
        this.$refs.chart.yUnits(y.units);
        this.$refs.chart.ylim(
          Math.min(...this.yValues),
          Math.max(...this.yValues)
        );
      } else {
        this.yValues = [];
        this.$refs.chart.ylim(0, 0);
      }
      this.update();
    }
  },
  activated() {
    this.$nextTick(() => this.update());
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

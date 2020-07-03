<template>
  <window-base title="Gráfica">
    <v-row no-gutters>
      <v-col cols="12" class="mb-4">
        <v-checkbox
          v-model="yMinAtZero"
          hide-details
          class="mt-0 pt-0"
          label="Iniciar eje vertical en 0"
        ></v-checkbox>
      </v-col>
      <v-col cols="12">
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
          <signal-selector
            v-model="varX"
            :signals="timeSignals"
          ></signal-selector>
        </div>
      </v-col>
    </v-row>
  </window-base>
</template>

<script>
import { state } from '@/store/index';
import { filterObj } from '@/lib/utils';
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
    yMinAtZero: false,
    style: {
      height: '284px',
      width: '100%'
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false
      },
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0
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
          pointRadius: 0,
          data: [],
          backgroundColor: 'rgba(0, 0, 0, 0)'
        }
      ]
    },
    varX: null,
    varY: null,
    xValues: [],
    yValues: [],
    isActive: false,
    needsInit: false
  }),
  watch: {
    yMinAtZero() {
      this.init();
    },
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
      if (!this.isActive) return;

      this.data.datasets[0].data = this.yValues.slice(0, this.limit);
      this.$refs.chart.update();
    },
    init() {
      if (!this.isActive) {
        this.needsInit = true;
        return;
      }
      this.needsInit = false;

      // Set dataset color to match the primary color.
      this.$refs.chart.color(0, this.$vuetify.theme.themes.light.primary);

      // Get x values from datapoints.
      if (this.varX) {
        const { units } = this.timeSignals[this.varX];
        this.xValues = this.datapoints.map(point => point[this.varX]);
        this.$refs.chart.xUnits(units);
      } else {
        this.xValues = [];
      }
      this.data.labels = this.xValues;

      // Get y values from datapoints and set -y limits.
      if (this.varY) {
        const { units } = this.otherSignals[this.varY];
        this.yValues = this.datapoints.map(point => point[this.varY]);
        const min = this.yMinAtZero ? 0 : Math.min(...this.yValues);
        const max = Math.max(...this.yValues);
        this.$refs.chart.yUnits(units);
        this.$refs.chart.ylim(min, max);
      } else {
        this.yValues = [];
        this.$refs.chart.ylim(0, 0);
      }
      this.update();
    }
  },
  activated() {
    this.isActive = true;
    this.$nextTick(() => {
      if (this.needsInit) {
        this.init();
      } else {
        this.update();
      }
    });
  },
  deactivated() {
    this.isActive = false;
  },
  computed: {
    timeSignals: () => filterObj(state.sim.signals, obj => obj.isTime),
    otherSignals: () => filterObj(state.sim.signals, obj => !obj.isTime),
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

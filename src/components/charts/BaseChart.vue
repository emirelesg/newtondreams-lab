<script>
import { Line } from 'vue-chartjs';

export default {
  name: 'Chart',
  extends: Line,
  props: ['chartData', 'options'],
  data() {
    return {};
  },
  methods: {
    xUnits(units) {
      this.$data._chart.options.tooltips.callbacks.title = (item, data) => {
        return `${data.labels[item[0].index]} ${units}`;
      };
    },
    yUnits(units) {
      this.$data._chart.options.tooltips.callbacks.label = item => {
        return `${item.yLabel} ${units}`;
      };
    },
    color(idx, color) {
      const dataset = this.$data._chart.data.datasets[idx];
      dataset.pointBackgroundColor = color;
      dataset.borderColor = color;
    },
    ylim(min, max) {
      const yAxis = this.$data._chart.options.scales.yAxes[0];
      if (!yAxis.ticks) yAxis.ticks = {};
      yAxis.ticks.min = min;
      yAxis.ticks.max = max;
    },
    update() {
      this.$data._chart.update();
    }
  },
  mounted() {
    if (this.$data._chart) this.$data._chart.destroy();
    this.renderChart(this.chartData, this.options);
  }
};
</script>

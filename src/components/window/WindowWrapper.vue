<template>
  <div class="window">
    <component :is="currentWindow"></component>
  </div>
</template>

<script>
import { state } from '@/store/index';
import WindowData from '@/components/window/WindowData.vue';
import WindowChart from '@/components/window/WindowChart.vue';

export default {
  name: 'WindowWrapper',
  components: {
    WindowData,
    WindowChart
  },
  data: () => ({
    currentWindow: null
  }),
  watch: {
    activeWindow() {
      this.set();
    }
  },
  mounted() {
    this.set();
  },
  methods: {
    set() {
      switch (this.activeWindow) {
        case 0:
          this.currentWindow = WindowData;
          break;
        case 1:
          this.currentWindow = WindowChart;
          break;
        default:
          this.currentWindow = null;
      }
    }
  },
  computed: {
    activeWindow: () => state.activeWindow
  }
};
</script>

<style scoped>
.window {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  width: 50%;
}
.window div {
  margin: 16px;
}
</style>

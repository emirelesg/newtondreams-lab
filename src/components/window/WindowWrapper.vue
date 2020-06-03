<template>
  <div class="window">
    <keep-alive>
      <component :is="windowComponent"></component>
    </keep-alive>
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
    windowComponent: null
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
      if (this.activeWindow === 0) {
        this.windowComponent = WindowData;
      } else if (this.activeWindow === 1) {
        this.windowComponent = WindowChart;
      } else {
        this.windowComponent = null;
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
  opacity: 1;
}
.window div {
  margin: 16px;
}
</style>

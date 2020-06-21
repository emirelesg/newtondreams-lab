<template>
  <div id="window" ref="window">
    <keep-alive>
      <component :is="windowComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
import { state } from '@/store/index';
import WindowData from '@/components/window/WindowData.vue';
import WindowChart from '@/components/window/WindowChart.vue';
import WindowSettings from '@/components/window/WindowSettings.vue';

export default {
  name: 'WindowWrapper',
  components: {
    WindowData,
    WindowChart,
    WindowSettings
  },
  data: () => ({
    windowComponent: null,
    windows: [WindowData, WindowChart, WindowSettings]
  }),
  watch: {
    activeWindow() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.windows[this.activeWindow]) {
        this.windowComponent = this.windows[this.activeWindow];
        this.$refs.window.classList.add('active');
      } else {
        this.$refs.window.classList.remove('active');
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
#window {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  opacity: 1;
  padding: 16px;
  width: 50%;
  height: 50%;
  height: 100%;
  display: none;
}

#window.active {
  display: block;
}

@media only screen and (max-width: 600px) {
  #window.active {
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div id="window">
    <v-dialog
      :value="!!windowComponent"
      attach="#window"
      no-click-animation
      persistent
      scrollable
      :transition="false"
      :retain-focus="false"
      hide-overlay
      @input="close"
    >
      <keep-alive>
        <component :is="windowComponent"></component>
      </keep-alive>
    </v-dialog>
  </div>
</template>

<script>
import { state, mutations } from '@/store/index';
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
      } else {
        this.windowComponent = null;
      }
    },
    close() {
      mutations.setActiveWindow(null);
    }
  },
  computed: {
    activeWindow: () => state.activeWindow
  }
};
</script>

<style scoped>
#window .v-dialog__content {
  position: absolute;
  left: auto;
  right: 0;
  opacity: 0.75;
  width: 600px;
  z-index: 1 !important;
}

#window .v-dialog__content:hover {
  opacity: 1;
}

@media only screen and (max-width: 600px) {
  #window .v-dialog__content {
    width: 100%;
    opacity: 1;
  }
}
</style>

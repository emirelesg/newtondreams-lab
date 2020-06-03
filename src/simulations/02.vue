<template>
  <v-container fuild fill-height ref="parent" id="canvasContainer">
    <canvas class="full-screen" ref="c"></canvas>
  </v-container>
</template>

<script>
import { mutations } from '@/store/index';
import p$ from 'newtondreams-lib';

export default {
  name: 'Sim2',
  components: {},
  data: () => ({
    w: null
  }),
  methods: {
    setup() {
      this.w = new p$.World('canvasContainer', this.draw, this.resize);
      this.w.fullscreen = false;
      const ball = new p$.Ball(1, { color: p$.COLORS.BLUE });
      this.w.add(ball);
      this.w.start();
    },
    resize() {
      this.w.axis.setPosition(this.w.width / 4, this.w.height / 2);
    },
    draw() {}
  },
  mounted() {
    this.$nextTick(() => {
      this.setup();
      mutations.resetSim();
    });
  },
  destroyed() {}
};
</script>

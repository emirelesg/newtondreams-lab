<template>
  <v-container fuild fill-height ref="parent" id="canvasContainer">
    <canvas class="full-screen" ref="c"></canvas>
  </v-container>
</template>

<script>
import p$ from 'newtondreams-lib';

export default {
  name: 'Sim1',
  components: {},
  data: () => ({
    w: null
  }),
  methods: {
    setup() {
      this.w = new p$.World('canvasContainer', this.draw, this.resize);
      this.w.fullscreen = false;
      const ball = new p$.Ball();
      this.w.add(ball);
      this.w.start();
    },
    resize() {
      this.w.axis.setPosition(this.w.width / 4, this.w.height / 2);
    },
    draw() {
      // const canvas = this.$refs.c;
      // const dpr = window.devicePixelRatio || 1;
      // const { width, height } = canvas.getBoundingClientRect();
      // canvas.width = width * dpr;
      // canvas.height = height * dpr;
      // const ctx = canvas.getContext('2d');
      // ctx.scale(dpr, dpr);
      // ctx.beginPath();
      // ctx.fillStyle = 'black';
      // ctx.rect(0, 0, width, height);
      // ctx.fill();
      // ctx.beginPath();
      // ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      // ctx.rect(0, 0, 50, 50);
      // ctx.rect(width - 50, 0, 50, 50);
      // ctx.rect(width - 50, height - 50, 50, 50);
      // ctx.rect(0, height - 50, 50, 50);
      // ctx.fill();
      // ctx.beginPath();
      // ctx.strokeStyle = 'red';
      // ctx.moveTo(0, 0);
      // ctx.lineTo(width, height);
      // ctx.moveTo(width, 0);
      // ctx.lineTo(0, height);
      // ctx.stroke();
    }
  },
  mounted() {
    this.$nextTick(() => this.setup());
  },
  destroyed() {}
};
</script>

<style scoped>
.full-screen {
  position: absolute;
  user-select: none;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

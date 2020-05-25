<template>
  <v-container fuild ref="parent">
    <canvas class="full-screen" ref="c"></canvas>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data: () => ({}),
  methods: {
    draw() {
      const canvas = this.$refs.c;
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      ctx.rect(0, 0, 50, 50);
      ctx.rect(width - 50, 0, 50, 50);
      ctx.rect(width - 50, height - 50, 50, 50);
      ctx.rect(0, height - 50, 50, 50);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.moveTo(width, 0);
      ctx.lineTo(0, height);
      ctx.stroke();
      ctx.beginPath();
    }
  },
  mounted() {
    window.addEventListener('resize', this.draw);
    this.draw();
  },
  destroyed() {
    window.removeEventListener('resize', this.draw);
  }
};
</script>

<style scoped>
.full-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

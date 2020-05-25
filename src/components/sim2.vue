<template>
  <v-container class="fill-height pa-0" fluid ref="parent">
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
      const parent = this.$refs.parent;
      canvas.width = parent.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = parent.clientHeight * (window.devicePixelRatio || 1);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'cyan';
      ctx.rect(0, 0, 50, 50);
      ctx.rect(canvas.width - 50, 0, 50, 50);
      ctx.rect(canvas.width - 50, canvas.height - 50, 50, 50);
      ctx.rect(0, canvas.height - 50, 50, 50);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.moveTo(canvas.width, 0);
      ctx.lineTo(0, canvas.height);
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

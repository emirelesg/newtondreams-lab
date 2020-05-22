<template>
  <v-container class="fill-height pa-0" fluid ref="parent">
    <canvas class="full-screen" ref="c"></canvas>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  methods: {
    draw() {
      const canvas = this.$refs.c;
      const parent = this.$refs.parent;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'cyan';
      ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
      ctx.fill();
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

<template>
  <div ref="parent" id="scene"></div>
</template>

<script>
import App from '@/lib/index';
import Box from '@/lib/elements/Box';

export default {
  name: 'Sim3',
  components: {},
  data: () => ({
    app: null,
    box: null,
    direc: true
  }),
  methods: {
    setup() {
      this.app = new App(this.$refs.parent, {});
      this.box = new Box();
      this.app.scene.add(this.box);
      this.app.renderer.setAnimationLoop(this.draw.bind(this));
      this.draw();
    },
    draw() {
      if (this.direc) {
        this.box.car.position.x += 0.5;
        if (this.box.car.position.x > 40) this.direc = false;
      } else {
        this.box.car.position.x -= 0.5;
        if (this.box.car.position.x < -45) this.direc = true;
      }
      this.app.renderer.render(this.app.scene, this.app.camera);
    },
    resize() {}
  },
  created() {
    this.$nextTick(() => this.setup());
  },
  beforeDestroy() {
    this.app.destroy();
    this.app = null;
  }
};
</script>

<style scoped>
#scene {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

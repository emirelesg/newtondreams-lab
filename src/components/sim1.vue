<template>
  <v-container fuild fill-height ref="parent" id="parent">
    <canvas class="full-screen" ref="c"></canvas>
  </v-container>
</template>

<script>
import p$ from 'newtondreams-lib';
import colors from 'vuetify/lib/util/colors';

export default {
  name: 'Sim1',
  components: {},
  data: () => ({
    w: null,
    shape: null,
    x: 0,
    time: 0
  }),
  methods: {
    setup() {
      this.w = new p$.World('parent', this.draw, this.resize);
      this.w.fullscreen = false;
      this.shape = new p$.Shape(this.drawShape);
      this.w.add(this.shape);
      this.w.start();
    },
    resize() {
      this.w.axis.setPosition(75, this.w.height / 2);
    },
    drawShape() {
      this.shape.noStroke();
      this.shape.fill(colors.indigo.base);
      this.shape.begin();
      this.shape.rect(10, 0, 1, 1);
      this.shape.end();

      this.shape.fill(colors.red.base);
      this.shape.begin();
      this.shape.rect(-1 + this.x, 0, 1, 0.5);
      this.shape.end();
    },
    draw() {
      // this.ball.setPosition(Math.sin(this.time), Math.sin(this.time));

      this.x = this.time += 0.1;
      if (this.x > 10) {
        this.x = 0;
        this.time = 0;
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.setup());
  },
  destroyed() {
    this.w.destroy();
  }
};
</script>

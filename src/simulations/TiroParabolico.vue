<template>
  <div ref="parent" class="full">
    <sim-header
      title="Tiro Parabólico"
      description="Determina el ángulo de lanzamiento con mayor alcance."
    >
    </sim-header>
    <sim-controls @input="handleControls"></sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';

const signals = {};
const controls = {
  angle: {
    type: 'slider',
    label: 'Inclinación',
    min: 0,
    max: 20,
    step: 1,
    value: 10,
    suffix: '°'
  }
};

export default {
  name: 'TiroParabolico',
  mixins: [SimMixin],
  components: {
    SimHeader,
    SimControls
  },
  data: () => ({
    model: null
  }),
  methods: {
    setup() {},
    reset() {},
    draw() {}
  },
  mounted() {
    this.init([], ['settings'], signals, controls);
  },
  beforeDestroy() {},
  computed: {}
};
</script>

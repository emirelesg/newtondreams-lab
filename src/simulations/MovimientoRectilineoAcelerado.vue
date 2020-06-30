<template>
  <div ref="parent" class="full">
    <sim-header
      title="Movimiento Rectilíneo Acelerado"
      description="Analiza un vehículo con aceleración constante."
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
const controls = {};

export default {
  name: 'MovimientoRectilineoAcelerado',
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
    this.init([], [], signals, controls);
  },
  beforeDestroy() {
    if (this.model) this.model.destroy();
    this.model = null;
    this.destroy();
  },
  computed: {}
};
</script>

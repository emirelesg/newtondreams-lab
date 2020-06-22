<template>
  <div ref="parent" class="full">
    <sim-header
      title="Mediciones"
      description="Mide los objectos haciendo clic sobre dos vertices."
    >
      <div class="primary--text font-weight-bold">
        <span v-if="model && model.distance">
          {{ getDistance() }} &plusmn; {{ error }} mm
        </span>
        <span v-else>-</span>
      </div>
    </sim-header>
    <sim-controls @input="handleControls"></sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import BasicShapes from '@/lib/elements/BasicShapes.js';
import { round, gaussianRandom } from '@/lib/utils.js';

export default {
  name: 'Mediciones',
  mixins: [SimMixin],
  components: {
    SimHeader,
    SimControls
  },
  data: () => ({
    model: null,
    error: 0.05
  }),
  methods: {
    setup() {
      if (this.model) this.model.destroy();
      this.model = new BasicShapes(this.app);
      this.app.scene.add(this.model);
    },
    getDistance() {
      return `${round(
        this.model.distance * 10 + gaussianRandom(-this.error, this.error),
        2
      ).toFixed(2)}`;
    }
  },
  mounted() {
    this.init([], [], {}, {});
  },
  beforeDestroy() {
    if (this.model) this.model.destroy();
    this.model = null;
    this.destroy();
  }
};
</script>

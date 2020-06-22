<template>
  <div ref="parent" class="full">
    <sim-header
      title="Mediciones"
      description="Mide los objectos haciendo clic sobre dos vertices."
    >
      <div class="primary--text font-weight-bold">
        {{ getDistance() }}
      </div>
    </sim-header>
  </div>
</template>

<script>
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import BasicShapes from '@/lib/elements/BasicShapes';
import { round, gaussianRandom } from '@/lib/utils';

export default {
  name: 'Mediciones',
  mixins: [SimMixin],
  components: {
    SimHeader
  },
  data: () => ({
    model: null
  }),
  methods: {
    setup() {
      if (this.model) this.model.destroy();
      this.model = new BasicShapes(this.app);
      this.app.scene.add(this.model);
    },
    getDistance() {
      if (this.model && this.model.distance) {
        return `${round(
          this.model.distance + gaussianRandom(-0.2, 0.2),
          2
        )} cm`;
      }
      return `-`;
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

<template>
  <div ref="parent" class="full">
    <sim-header
      title="Peso Aparente"
      description="Calcula la densidad de los objetos."
    >
    </sim-header>
    <sim-controls @input="handleControls"></sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import ApparentWeight from '@/lib/elements/ApparentWeight.js';
import { state } from '@/store/index.js';
import { round } from '@/lib/utils.js';

const signals = {};
const controls = {
  material: {
    type: 'options',
    label: 'Material',
    values: [
      { text: 'Cobre', value: 'copper' },
      { text: 'Latón', value: 'brass' },
      { text: 'Aluminio', value: 'aluminium' }
    ],
    value: 'copper'
  }
};

const colors = {
  copper: '#E49B7A',
  brass: '#CDB06A',
  aluminium: '#AFAFB1'
};

const weightRadius = 1; // cm
const weightHeight = 2.5; // cm
const weightVol = weightRadius * weightRadius * Math.PI * weightHeight; // cm^3
const containerRadius = 3.65; // cm
const displacedHeight =
  weightVol / (Math.PI * containerRadius * containerRadius); // cm

// Densities obtained from https://www.engineersedge.com/materials/densities_of_metals_and_elements_table_13976.htm
const masses = {
  copper: round(8.92 * weightVol, 1),
  brass: round(8.5 * weightVol, 1),
  aluminium: round(2.7 * weightVol, 1)
};

export default {
  name: 'Energia',
  mixins: [SimMixin],
  components: {
    SimHeader,
    SimControls
  },
  data: () => ({
    model: null
  }),
  methods: {
    setup() {
      this.model = new ApparentWeight();
      this.app.scene.add(this.model);
      this.app.scene.position.y = -10;
      return this.model.load();
    },
    reset() {
      this.model.weight.material.color.setStyle(
        colors[state.sim.settings.material.value]
      );
      this.setAnimationData(this.simulate(1 / 50, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
    },
    draw(frame, i) {
      if (frame && this.model && this.model.loaded) {
        this.model.setWaterHeight(i * 0.06);
      }
    },
    simulate(dt) {
      // Based on https://www.fisic.ch/contenidos/mec%C3%A1nica-de-fluidos/principio-de-arquimides/
      const weightMass = masses[state.sim.settings.material.value]; // g
      const waterDensity = 1; // g / cm³
      const apparentMass = weightMass - weightVol * waterDensity; // g

      // Density can be calculated by doing: waterDensity / (1 - apparentMass / weightMass)
      // console.log(1 / (1 - apparentMass / weightMass));
      apparentMass;
      displacedHeight;

      let signals = [];
      for (let t = 0; t < 1; t += dt) {
        signals.push({
          t
        });
      }
      return signals;
    }
  },
  mounted() {
    this.init(['start'], ['settings', 'data', 'graph'], signals, controls);
  },
  beforeDestroy() {
    if (this.model) this.model.destroy();
    this.model = null;
    this.destroy();
  }
};
</script>

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
import ApparentWeightSystem from '@/lib/elements/ApparentWeightSystem.js';
import { state } from '@/store/index.js';
import { round, guassianNoiseIf } from '@/lib/utils.js';

const signals = {
  t: {
    name: 'Tiempo',
    units: 's',
    isTime: true
  },
  mass: {
    name: 'Masa Aparente',
    units: 'g'
  }
};
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
  },
  liquid: {
    type: 'options',
    label: 'Líquido',
    values: [
      { text: 'Agua (1000 kg/m³)', value: 'water' },
      { text: 'Aceite de Oliva (911 kg/m³)', value: 'oliveOil' },
      { text: 'Alcohol Etílico (785.1 kg/m³)', value: 'alcohol' }
    ],
    value: 'water'
  }
};

const liquidColors = {
  water: '#20a4d4',
  oliveOil: '#ccbd2d',
  alcohol: '#c1dee8'
};

// Source: https://www.engineeringtoolbox.com/liquids-densities-d_743.html
const liquidDensities = {
  water: 1,
  oliveOil: 0.911,
  alcohol: 0.7851
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
      this.model = new ApparentWeightSystem();
      this.app.zoom(0.75);
      this.app.scene.add(this.model);
      this.app.scene.position.y = -10;
      return this.model.load();
    },
    reset() {
      this.model.weight.material.color.setStyle(
        colors[state.sim.settings.material.value]
      );
      this.model.water.material.color.setStyle(
        liquidColors[state.sim.settings.liquid.value]
      );
      this.setAnimationData(this.simulate(1 / 50, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
    },
    draw(frame) {
      if (frame && this.model && this.model.loaded) {
        const { mass, posY, waterLevel } = frame;
        this.model.setWaterHeight(waterLevel);
        this.model.setDynWeight(mass);
        this.model.dyn.position.y = posY + this.model.cupThickness;
      }
    },
    simulate(dt, noise) {
      // Based on https://www.fisic.ch/contenidos/mec%C3%A1nica-de-fluidos/principio-de-arquimides/
      const weightMass = masses[state.sim.settings.material.value]; // g
      const liquidDensity = liquidDensities[state.sim.settings.liquid.value]; // g / cm³
      // Density can be calculated by doing: liquidDensity / (1 - apparentMass / weightMass)
      // console.log(
      //   liquidDensity /
      //     (1 - (weightMass - weightVol * liquidDensity) / weightMass)
      // );

      // Y position of the weight, referenced to the top of the liquid.
      let posY = 10;

      // Amount the water level has increased.
      let waterLevel = 0;

      // Mass measured by the dynamometer.
      let mass = weightMass;

      let signals = [];
      let t = 0;

      // Sink the weight until it is at the center of the water.
      const { waterHeight } = this.model;
      const finalPosY = (waterHeight - weightHeight) / 2;
      while (posY > finalPosY && t < 5) {
        // Interpolate the final water level and apparent mass while the weight is sinking.
        if (posY < waterHeight && posY > waterHeight - weightHeight) {
          const sunkPercent =
            1 - (posY - (waterHeight - weightHeight)) / weightHeight;
          waterLevel = sunkPercent * displacedHeight;
          mass = weightMass - sunkPercent * weightVol * liquidDensity;
        }
        signals.push({
          t: round(t, 2),
          mass: round(mass + guassianNoiseIf(noise, 0.2), 4),
          posY,
          waterLevel
        });

        // Continue sinking and advancing time.
        posY -= 5 * dt;
        t += dt;
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

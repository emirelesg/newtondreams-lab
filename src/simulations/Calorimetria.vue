<template>
  <div ref="parent" class="full">
    <sim-header title="Calorimetría" description="*descripción*"> </sim-header>
    <sim-controls @input="handleControls"></sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import CalorimetrySystem from '@/lib/elements/CalorimetrySystem.js';
import { state } from '@/store/index.js';
import { round, guassianNoiseIf } from '@/lib/utils.js';

const signals = {
  t: {
    name: 'Tiempo',
    units: 's',
    isTime: true
  },
  temp: {
    name: 'Temperatura',
    units: '°C'
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
  massWater: {
    type: 'slider',
    label: 'Masa de agua',
    min: 50,
    max: 200,
    step: 10,
    value: 100,
    suffix: 'g'
  },
  temp: {
    type: 'slider',
    label: 'Temperatura del metal',
    min: 40,
    max: 100,
    step: 5,
    value: 100,
    suffix: '°C'
  }
};

const colors = {
  copper: '#E49B7A',
  brass: '#CDB06A',
  aluminium: '#AFAFB1'
};

const weightDiameter = 1;
const weightHeight = 1;
const weightVol = (weightDiameter / 2) * Math.PI * Math.PI * weightHeight;

// Densities obtained from https://www.engineersedge.com/materials/densities_of_metals_and_elements_table_13976.htm
const masses = {
  copper: round(8.96 * weightVol, 1),
  brass: round(8.5 * weightVol, 1),
  aluminium: round(2.7 * weightVol, 1)
};

const specificHeat = {
  water: 4.18,
  copper: 0.685,
  brass: 0.377,
  aluminium: 0.903
};

export default {
  name: 'Calorimetria',
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
      this.model = new CalorimetrySystem({
        weightColor: colors[state.sim.settings.material.value],
        hotPlateTemp: state.sim.settings.temp.value,
        hotPlateMass: masses[state.sim.settings.material.value]
      });
      this.app.scene.add(this.model);
      this.app.scene.position.y = -5;
      return this.model.load();
    },
    reset() {
      this.model.weight.material.color.setStyle(
        colors[state.sim.settings.material.value]
      );
      this.model.setHotPlateTemp(state.sim.settings.temp.value);
      this.model.setHotPlateMass(masses[state.sim.settings.material.value]);
      this.setAnimationData(this.simulate(1 / 60, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
    },
    simulate(dt, noise) {
      // Equations based on https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Thermodynamics/Calorimetry/Constant_Pressure_Calorimetry
      const csWater = specificHeat.water;
      const tempWater = 20;
      const mWater = state.sim.settings.massWater.value;
      const cMetal = specificHeat[state.sim.settings.material.value];
      const mMetal = masses[state.sim.settings.material.value];
      const tempMetal = state.sim.settings.temp.value;
      const tempFinal =
        (mWater * csWater * tempWater + mMetal * cMetal * tempMetal) /
        (mWater * csWater + mMetal * cMetal);
      const tempDelta = tempFinal - tempWater;

      // Second order system.
      let t = 0;
      const ts = 0.15; // Time constant of the system. Determines the speed.
      const tEnd = ts * 10; // Time until the system stabilizes.
      const tAnimation = this.model.animationLength / 60; // Duration of the animation, which is always played back at 60fps.

      let signals = [];

      // During the animation push stable values.
      while (t < tAnimation) {
        signals.push({
          t: round(t, 2),
          temp: round(tempWater, 1)
        });
        t += dt;
      }

      while (t <= tAnimation + tEnd) {
        // Calculate the after the animation.
        const x = t - tAnimation;

        // Second order differential equation.
        // Model obtained from https://apmonitor.com/pdc/index.php/Main/SecondOrderSystems
        const currentTemp =
          tempWater + tempDelta * (1 - (1 + x / ts) * Math.exp(-x / ts));

        signals.push({
          t: round(t, 2),
          temp: round(currentTemp + guassianNoiseIf(noise, 0.1), 1)
        });
        t += dt;
      }

      return signals;
    },
    draw(frame, i) {
      if (frame && this.model && this.model.loaded) {
        this.model.setWeightPos(i);
        this.model.setLidPos(i);
        const { temp } = frame;
        this.model.setThermometerTemp(temp);
      }
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

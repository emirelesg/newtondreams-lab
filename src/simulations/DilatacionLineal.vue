<template>
  <div ref="parent" class="full">
    <sim-header
      title="Dilatación Lineal"
      description=" Analiza la dilatación térmica de distintos materiales."
    >
    </sim-header>
    <sim-controls @input="handleControls"> </sim-controls>
  </div>
</template>

<script>
import SimControls from '@/components/sim/SimControls.vue';
import SimHeader from '@/components/sim/SimHeader.vue';
import SimMixin from '@/components/sim/SimMixin.js';
import { state, mutations } from '@/store/index.js';
import ThermalExpansionSystem from '@/lib/elements/ThermalExpansionSystem.js';
import { round, guassianNoiseIf } from '@/lib/utils.js';

const signals = {
  t: {
    name: 'Tiempo',
    units: 's',
    isTime: true
  },
  dLength: {
    name: 'Delta Longitud',
    units: 'μm'
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
  }
};

const colors = {
  copper: '#E49B7A',
  brass: '#CDB06A',
  aluminium: '#AFAFB1'
};

// Based on https://www.engineeringtoolbox.com/linear-expansion-coefficients-d_95.html
const alphas = {
  copper: 16.5e-6,
  brass: 19e-6,
  aluminium: 23.1e-6
};

export default {
  name: 'DilatacionLineal',
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
      this.model = new ThermalExpansionSystem(this.app);
      this.app.zoom(0.75);
      this.app.scene.add(this.model);
      return this.model.load();
    },
    reset() {
      this.model.rod.material.color.setStyle(
        colors[state.sim.settings.material.value]
      );
      this.model.updateFires(0, 0);
      this.setAnimationData(this.simulate(1 / 50, false));
      this.setSimulationData(this.simulate(state.sim.sampleTime, true));
    },
    draw(frame, i) {
      if (frame) {
        const { dLength } = frame;
        this.model.setGauge(dLength);
        // Update fire only if the simulation is running.
        if (state.sim.isRunning) {
          let opacity = 1;
          if (i <= 30) {
            // Linear fade-in fire.
            opacity = i / 30;
          } else if (i > this.animation.length - 30) {
            // Linear fade-out fire.
            opacity = (this.animation.length - i) / 30;
          }
          this.model.updateFires(1 / 50, opacity);
        }
      }
    },
    simulate(dt, noise) {
      // Formulas based on http://lauprof2.blogspot.com/2014/09/42-dilatacion-lineal-actividad-4.html
      const length0 = this.model.rod.geometry.parameters.height / 100; // cm;
      const temp0 = 20; // °C
      const alpha = alphas[state.sim.settings.material.value]; // m · m−1 · K−1;
      const signals = [];
      const tEnd = 10;
      for (let t = 0; t <= tEnd; t += dt) {
        const dTemp = (40 * t) / tEnd;
        const dLength = alpha * length0 * dTemp + guassianNoiseIf(noise, 1e-5);
        signals.push({
          t: round(t, 2),
          dLength: round(dLength * 1e6, 0), // um
          temp: round(temp0 + dTemp + guassianNoiseIf(noise, 0.1), 1)
        });
      }
      return signals;
    }
  },
  mounted() {
    this.init(['start'], ['settings', 'data', 'graph'], signals, controls);
    // Since simulation lasts a couple of seconds, reduce the amount of data points by using a lower
    // sample time.
    mutations.setSimSampleTime(1 / 10);
  },
  beforeDestroy() {
    if (this.model) this.model.destroy();
    this.model = null;
    this.destroy();
  }
};
</script>

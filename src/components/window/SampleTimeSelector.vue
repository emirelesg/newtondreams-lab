<template>
  <v-select
    @input="set"
    :value="current"
    :items="times"
    hide-details
    label="Frecuencia de muestreo"
  ></v-select>
</template>

<script>
import { state, mutations } from '@/store/index';

export default {
  name: 'SampleTimeSelector',
  data: () => ({
    times: [
      { text: '10 Hz', value: 1 / 10 },
      { text: '20 Hz', value: 1 / 20 },
      { text: '50 Hz', value: 1 / 50 },
      { text: '100 Hz', value: 1 / 100 }
    ]
  }),
  methods: {
    set(dt) {
      mutations.setSimSampleTime(dt);
      mutations.resetSim();
    }
  },
  computed: {
    current: () => state.sim.sampleTime
  }
};
</script>

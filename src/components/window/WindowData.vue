<template>
  <window-base title="Datos">
    <sample-time-selector></sample-time-selector>
    <v-simple-table fixed-header height="300px" class="data-table border">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th
              class="text-left"
              v-for="(signal, idx) in selectedSignals"
              :key="`col-${idx}`"
            >
              <div>
                <signal-selector
                  v-model="selectedSignals[idx]"
                  :signals="signals"
                ></signal-selector>
                <v-btn
                  color="grey"
                  icon
                  class="ml-1"
                  @click="removeSignal(idx)"
                >
                  <v-icon size="20">mdi-delete</v-icon>
                </v-btn>
              </div>
            </th>
            <th>
              <v-btn color="green" icon @click="addSignal">
                <v-icon size="20">mdi-plus</v-icon>
              </v-btn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, idx) in limit" :key="`row-${idx}`">
            <td>{{ idx + 1 }}</td>
            <td
              v-for="(signal, idy) in selectedSignals"
              :key="`row-${idx}-col-${idy}`"
            >
              <span>{{ datapoints[idx][signals[signal].var] }}</span>
              <span class="units secondary--text ml-1">
                {{ signals[signal].units }}
              </span>
            </td>
            <td></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </window-base>
</template>

<script>
import { state } from '@/store/index';
import WindowBase from '@/components/window/WindowBase';
import SignalSelector from '@/components/window/SignalSelector';
import SampleTimeSelector from '@/components/window/SampleTimeSelector';

export default {
  name: 'WindowData',
  components: {
    WindowBase,
    SignalSelector,
    SampleTimeSelector
  },
  data: () => ({
    selectedSignals: [null]
  }),
  methods: {
    addSignal() {
      this.selectedSignals.push(this.signals.length > 0 ? 0 : null);
    },
    removeSignal(idx) {
      this.selectedSignals.splice(idx, 1);
    },
    reset() {
      this.selectedSignals = [null];
    }
  },
  computed: {
    signals: () => state.sim.signals,
    datapoints: () => state.sim.data,
    limit: () => state.sim.displayLimit
  },
  mounted() {
    state.bus.$on('resetWindow', this.reset);
  },
  beforeDestroy() {
    state.bus.$off('resetWindow', this.reset);
  }
};
</script>

<style scoped>
.data-table thead tr th div:first-child {
  display: flex;
  align-items: center;
  justify-content: start;
}
.data-table thead tr th:first-child,
.data-table thead tr th:last-child {
  width: 1%;
}
.data-table .units {
  user-select: none;
}
</style>
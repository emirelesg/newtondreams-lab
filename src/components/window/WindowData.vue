<template>
  <window-base title="Datos" v-if="isActive">
    <v-row no-gutters>
      <v-col cols="12" class="mb-4">
        <sample-time-selector></sample-time-selector>
      </v-col>
      <v-col cols="12" class="mb-4">
        <v-btn id="copyButton" color="blue-grey" outlined small>
          <v-icon small left>mdi-clipboard-outline</v-icon>Copiar Datos
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-simple-table
          dense
          fixed-header
          height="250px"
          class="data-table border"
          id="myDataTable"
        >
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
                  {{ signals[signal] ? datapoints[idx][signal] : 0 }}
                </td>
                <td></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </window-base>
</template>

<script>
import { state, mutations } from '@/store/index';
import WindowBase from '@/components/window/WindowBase';
import SignalSelector from '@/components/window/SignalSelector';
import SampleTimeSelector from '@/components/window/SampleTimeSelector';
import Clipboard from 'clipboard';

export default {
  name: 'WindowData',
  components: {
    WindowBase,
    SignalSelector,
    SampleTimeSelector
  },
  data: () => ({
    clipboard: null,
    selectedSignals: [null],
    isActive: false
  }),
  methods: {
    addSignal() {
      this.selectedSignals.push(null);
    },
    removeSignal(idx) {
      this.selectedSignals.splice(idx, 1);
    },
    reset() {
      this.selectedSignals = [null];
    },
    copySuccess(e) {
      e.clearSelection();
      mutations.setSnackbarMessage('Datos copiados exitosamente.', 'success');
    },
    copyError() {
      mutations.setSnackbarMessage(
        'Presiona CTRL+C para copiar los datos.',
        'error'
      );
    }
  },
  computed: {
    signals: () => state.sim.signals,
    datapoints: () => state.sim.data,
    limit: () => state.sim.displayLimit
  },
  activated() {
    this.isActive = true;
    this.$nextTick(function() {
      this.clipboard = new Clipboard('#copyButton', {
        target: () => document.querySelector('#myDataTable table')
      });
      this.clipboard.on('success', this.copySuccess);
      this.clipboard.on('error', this.copyError);
    });
    state.bus.$on('resetWindow', this.reset);
  },
  deactivated() {
    this.isActive = false;
    this.clipboard.destroy();
    state.bus.$off('resetWindow', this.reset);
  }
};
</script>

<style scoped>
.data-table thead tr th div:first-child {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.data-table thead tr th:first-child,
.data-table thead tr th:last-child {
  width: 1%;
}
</style>

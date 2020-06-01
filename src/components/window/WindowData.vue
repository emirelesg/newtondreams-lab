<template>
  <window-base title="Datos">
    <v-select
      v-model="selectedSampleTime"
      :items="sampleTimes"
      label="Tiempo de muestreo"
    ></v-select>
    <v-simple-table fixed-header height="300px" class="data-table border">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">
              <div>
                <signal-selector></signal-selector>
                <v-btn color="grey" icon class="ml-1">
                  <v-icon size="20">mdi-delete</v-icon>
                </v-btn>
              </div>
            </th>
            <th>
              <v-btn color="green" icon>
                <v-icon size="20">mdi-plus</v-icon>
              </v-btn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>0</td>
            <td></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </window-base>
</template>

<script>
import WindowBase from '@/components/window/WindowBase';
import SignalSelector from '@/components/window/SignalSelector';

export default {
  name: 'WindowData',
  components: {
    WindowBase,
    SignalSelector
  },
  data: () => ({
    sampleTimes: [
      { text: '10 Hz', value: 1 / 10 },
      { text: '20 Hz', value: 1 / 20 },
      { text: '50 Hz', value: 1 / 50 },
      { text: '100 Hz', value: 1 / 100 }
    ],
    selectedSampleTime: 1 / 50
  }),
  methods: {
    changeSignal() {}
  }
};
</script>

<style scoped>
.data-table thead tr th div:first-child {
  display: flex;
  align-items: center;
  justify-content: start;
}
.data-table thead tr th:last-child {
  width: 1%;
}
</style>

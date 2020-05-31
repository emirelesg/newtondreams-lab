<template>
  <v-card elevation="7">
    <v-card-title>
      <span class="headline">Datos</span>
      <v-spacer></v-spacer>
      <v-btn icon color="secondary">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-select
        v-model="selectedSampleTime"
        :items="sampleTimes"
        label="Tiempo de muestreo"
      ></v-select>
      <v-simple-table fixed-header height="300px" class="data-table">
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
    </v-card-text>
  </v-card>
</template>

<script>
import SignalSelector from '@/components/window/SignalSelector';

export default {
  name: 'WindowData',
  components: {
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
.data-table {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-width: thin;
}
.data-table thead tr th div:first-child {
  display: flex;
  align-items: center;
  justify-content: start;
}
.data-table thead tr th:last-child {
  width: 1%;
}
</style>

<template>
  <v-menu offset-y>
    <template v-slot:activator="scope">
      <v-btn
        small
        :color="selected > 0 ? 'primary' : 'secondary'"
        outlined
        v-on="scope.on"
        class="selector-btn"
      >
        {{ signals[selected] }}
        <v-icon right size="20">
          {{ scope.value ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group
        active-class="primary--text"
        v-model="selected"
        mandatory
      >
        <v-list-item v-for="(signal, idx) in signals" :value="idx" :key="idx">
          <v-list-item-title>{{ signal }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'SignalSelector',
  data: () => ({
    signals: ['Sin señal', 'Tiempo', 'Posición', 'Velocidad', 'Aceleración'],
    selected: 0
  }),
  methods: {}
};
</script>

<style scoped>
.selector-btn {
  text-transform: none;
}
</style>

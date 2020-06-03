<template>
  <v-menu offset-y>
    <template v-slot:activator="scope">
      <v-btn
        small
        :color="value !== null ? 'primary' : 'secondary'"
        outlined
        v-on="scope.on"
        class="selector-btn"
      >
        {{ value !== null ? signals[value].name : 'Sin señales' }}
        <v-icon right size="20">
          {{ scope.value ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group
        active-class="primary--text"
        v-model="signal"
        mandatory
      >
        <v-list-item v-for="(signal, idx) in signals" :value="idx" :key="idx">
          <v-list-item-title>{{ signal.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'SignalSelector',
  props: {
    signals: { type: Array, required: true },
    value: { type: Number, default: null }
  },
  data: () => ({}),
  watch: {
    signals() {
      this.reset();
    }
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      if (this.signals.length > 0) {
        if (this.value === null) {
          this.$emit('input', 0);
        }
      } else {
        this.$emit('input', null);
      }
    }
  },
  computed: {
    signal: {
      get: function() {
        return this.value;
      },
      set: function(newSignal) {
        this.$emit('input', newSignal);
      }
    }
  }
};
</script>

<style scoped>
.selector-btn {
  text-transform: none;
}
</style>

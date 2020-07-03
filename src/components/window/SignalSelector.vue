<template>
  <v-menu offset-y>
    <template v-slot:activator="scope">
      <v-btn
        small
        :color="validSelection ? 'primary' : 'secondary'"
        outlined
        v-on="scope.on"
        class="selector-btn"
      >
        <span>
          {{ validSelection ? getLabel(signals[value]) : 'Sin señales' }}
        </span>
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
          <v-list-item-title>{{ getLabel(signal) }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'SignalSelector',
  props: {
    signals: { type: Object, required: true },
    value: { type: String, default: null }
  },
  data: () => ({}),
  watch: {
    signals() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // All signal selectors start with the value of null. Once signals are loaded,
      // and current value is null, the first element is selected.
      // If no signals are found, then the value is set to null.
      const keys = Object.keys(this.signals);
      if (keys.length > 0) {
        if (this.value === null) {
          this.$emit('input', keys[0]);
        }
      } else {
        this.$emit('input', null);
      }
    },
    getLabel({ name, units }) {
      return `${name} (${units})`;
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
    },
    validSelection() {
      return this.value !== null && this.signals[this.value];
    }
  }
};
</script>

<style scoped>
.selector-btn {
  text-transform: none;
}
</style>

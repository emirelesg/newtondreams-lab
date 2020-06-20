<template>
  <div class="d-flex flex-grow-1">
    <v-slider
      v-model="value"
      ticks="always"
      hide-details
      :label="conf.label"
      :step="conf.step"
      :max="conf.max"
      :min="conf.min"
    >
    </v-slider>
    <div style="width: 60px" class="ml-3">
      <v-text-field
        v-model="value"
        class="mt-0 pt-0"
        dense
        hide-details
        single-line
        :step="conf.step"
        :max="conf.max"
        :min="conf.min"
        :suffix="conf.suffix"
        type="number"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingSlider',
  props: {
    conf: { required: true, type: Object }
  },
  data: () => ({}),
  computed: {
    value: {
      get: function() {
        return this.conf.value;
      },
      set: function(value) {
        this.$emit('input', value);
      }
    }
  }
};
</script>

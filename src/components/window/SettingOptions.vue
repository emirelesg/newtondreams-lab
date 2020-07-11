<template>
  <v-select
    class="mb-2"
    hide-details
    v-model="value"
    :items="conf.values"
    :label="conf.label"
  ></v-select>
</template>

<script>
export default {
  name: 'SettingOptions',
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

<template>
  <v-snackbar v-model="show" :color="color" :timeout="3000" top>
    {{ message }}
    <v-btn dark @click="show = false" icon>
      <v-icon small>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { state, mutations } from '@/store/index';

export default {
  name: 'AppSnackbar',
  data: () => ({
    show: false
  }),
  watch: {
    show(val) {
      if (!val) mutations.setSnackbarMessage(null, null);
    },
    message(val) {
      if (val && val !== '') this.show = true;
    }
  },
  computed: {
    message: () => state.snackbar.message,
    color: () => state.snackbar.color
  }
};
</script>

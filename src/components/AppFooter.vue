<template>
  <v-footer
    app
    class="secondary--text footer caption border-top background"
    elevation="0"
  >
    <span>
      Universidad de Monterrey &copy; 2014 -
      {{ new Date().getFullYear() }}
    </span>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data: () => ({})
};
</script>

<style scoped>
.footer {
  bottom: -1px !important;
}
</style>

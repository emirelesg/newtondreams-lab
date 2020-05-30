<template>
  <v-footer app class="secondary--text footer caption" elevation="0">
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
  background-color: #f5f7fa !important;
  border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-width: thin;
  bottom: -1px !important;
}
</style>

<template>
  <v-footer
    absolute
    class="secondary--text footer caption border-top background"
    elevation="0"
  >
    <div>
      Universidad de Monterrey
    </div>
    <div>
      &copy; 2014 -
      {{ new Date().getFullYear() }}
    </div>
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
  left: -1px !important;
}
</style>

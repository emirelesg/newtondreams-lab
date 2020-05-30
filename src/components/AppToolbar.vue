<template>
  <v-sheet class="toolbar">
    <div class="toolbar-container">
      <v-btn color="green--text">
        <v-icon>mdi-play</v-icon>
        <span>Simular</span>
      </v-btn>
      <v-divider class="mx-4" vertical></v-divider>
      <v-btn class="primary--text lighten-1">
        <v-icon>mdi-table-large</v-icon>
        <span>Datos</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-chart-line</v-icon>
        <span>Gráficas</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-cog</v-icon>
        <span>Ajustes</span>
      </v-btn>
      <!-- <v-spacer></v-spacer> -->
    </div>
  </v-sheet>
  <!-- <v-bottom-navigation
        v-model="toolbar"
        :horizontal="$vuetify.breakpoint.smAndUp"
        color="primary lighten-1"
        class="elevation-0 toolbar"
        style="justify-content: flex-start !important;"
      >
        <v-btn class="d-none"></v-btn>
        <v-btn>
          <span>Datos</span>
          <v-icon>mdi-table-large</v-icon>
        </v-btn>
        <v-btn>
          <span>Gráficas</span>
          <v-icon>mdi-chart-line</v-icon>
        </v-btn>
        <v-btn>
          <span>Ajustes</span>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </v-bottom-navigation> -->
</template>

<script>
export default {
  name: 'AppToolbar',
  data: () => ({})
};
</script>

<style scoped>
.toolbar {
  height: 56px;
  background-color: #f5f7fa !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-width: thin;
}

.toolbar-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
}

.toolbar-container button {
  height: 100% !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border-radius: 0;
  text-transform: none;
  color: rgba(0, 0, 0, 0.6);
}

.toolbar-container button .v-btn__content span {
  font-size: 0.75rem;
}

.toolbar-container button .v-btn__content i {
  margin-right: 15px;
}
</style>

<template>
  <v-app class="app">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="elevation-7 pa-5">
              <v-card-text>
                <div class="text-center py-7">
                  <div class="display-1 mb-2">
                    NewtonDreams <strong class="primary--text">Lab</strong>
                  </div>
                  <div class="secondary--text overline">
                    Plataforma digital para prácticas de laboratorio
                  </div>
                </div>
                <v-form>
                  <v-text-field
                    id="password"
                    label="Contraseña"
                    name="password"
                    type="password"
                    append-icon="mdi-lock"
                    autofocus
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="secondary" text>
                  <v-icon left>mdi-arrow-left</v-icon>
                  Regresar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary">
                  Acceder
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'LayoutSignIn',
  data: () => ({})
};
</script>

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
                <v-form @submit.prevent="signIn" ref="form">
                  <v-text-field
                    label="Contraseña"
                    autocomplete="off"
                    ref="password"
                    :error-messages="errors"
                    type="password"
                    v-model="password"
                    append-icon="mdi-lock"
                    autofocus
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="secondary" text @click="goBack">
                  <v-icon left>mdi-arrow-left</v-icon>
                  Regresar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="signIn" :disabled="!password">
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
import { actions } from '@/store/index.js';

export default {
  name: 'LayoutSignIn',
  data: () => ({
    errors: [],
    password: null
  }),
  watch: {
    password() {
      if (this.errors.length) this.errors = [];
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    signIn() {
      if (this.password) {
        if (actions.authenticate(this.password)) {
          this.$router.push({ name: 'home' });
        } else {
          this.$refs.form.reset();
          this.$refs.password.focus();
          this.$nextTick(() => {
            this.errors = ['Contraseña incorrecta'];
          });
        }
      }
    }
  }
};
</script>

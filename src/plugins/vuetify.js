import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import es from 'vuetify/lib/locale/es';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { es },
    current: 'es'
  },
  theme: {
    options: {},
    themes: {
      light: {
        primary: colors.indigo.accent4,
        secondary: colors.grey.darken1
      }
    }
  }
});

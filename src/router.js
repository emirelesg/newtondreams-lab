import Vue from 'vue';
import VueRouter from 'vue-router';
import { getters, actions } from '@/store/index';
import LayoutHome from '@/views/LayoutHome';
import LayoutSignIn from '@/views/LayoutSignIn';

Vue.use(VueRouter);

// Middleware for pages that do not require authentication.
// If authenticated, the user will be sent to the main route.
const ifNotAuthenticated = (to, from, next) => {
  if (!getters.isAuthenticated()) {
    next();
    return;
  }
  next('/');
};

// Middleware for pages that require authentication.
// If not authenticated, the user will be sent to the signin page.
const ifAuthenticated = (to, from, next) => {
  if (getters.isAuthenticated()) {
    next();
    return;
  }
  next('/sign-in');
};

export const labs = [
  {
    name: 'Mediciones',
    path: 'mediciones',
    component: () =>
      import(
        /* webpackChunkName: "lab.mediciones" */ '@/simulations/Mediciones.vue'
      ),
    beforeEnter: actions.cleanup
  },
  {
    name: 'Movimiento Rectilíneo Uniforme',
    path: 'movimiento_rectilineo_uniforme',
    component: () =>
      import(
        /* webpackChunkName: "lab.movimiento_rectilineo_uniforme" */ '@/simulations/MovimientoRectilineoUniforme.vue'
      ),
    beforeEnter: actions.cleanup
  },
  {
    name: 'Movimiento Rectilíneo Acelerado',
    path: 'movimiento_rectilineo_acelerado',
    component: () =>
      import(
        /* webpackChunkName: "lab.movimiento_rectilineo_acelerado" */ '@/simulations/MovimientoRectilineoAcelerado.vue'
      ),
    beforeEnter: actions.cleanup
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/lab/' : '/',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: LayoutHome,
      beforeEnter: ifAuthenticated,
      children: labs
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: LayoutSignIn,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '*',
      name: 'wildcard',
      beforeEnter: (to, from, next) => {
        next('/');
        return;
      }
    }
  ]
});

export default router;

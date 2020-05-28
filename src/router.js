import Vue from 'vue';
import VueRouter from 'vue-router';
import { getters } from '@/store/index';
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
1;
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
    name: 'Velocidad',
    path: 'velocidad',
    component: () =>
      import(/* webpackChunkName: "lab.1" */ '@/components/sim1.vue')
  },
  {
    name: 'Trabajo',
    path: 'trabajo',
    component: () =>
      import(/* webpackChunkName: "lab.2" */ '@/components/sim2.vue')
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
      path: '/sign-in',
      name: 'sign-in',
      component: LayoutSignIn,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/',
      name: 'home',
      component: LayoutHome,
      beforeEnter: ifAuthenticated,
      children: labs
    }
  ]
});

export default router;

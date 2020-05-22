import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index.js';
import LayoutHome from '@/views/LayoutHome';
import LayoutSignIn from '@/views/LayoutSignIn';

Vue.use(VueRouter);

// Middleware for pages that do not require authentication.
// If authenticated, the user will be sent to the main route.
const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/');
};

// Middleware for pages that require authentication.
// If not authenticated, the user will be sent to the signin page.
const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/signin');
};

// Define all available labs on the main page.
export const labs = [
  {
    path: 'sim1',
    component: () =>
      import(/* webpackChunkName: "sim-1" */ '@/components/sim1.vue')
  },
  {
    path: 'sim2',
    component: () =>
      import(/* webpackChunkName: "sim-2" */ '@/components/sim2.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/signin',
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

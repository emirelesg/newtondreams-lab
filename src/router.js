import Vue from 'vue';
import VueRouter from 'vue-router';
import { getters, actions } from '@/store/index';
import LayoutHome from '@/views/LayoutHome';
import labs from '@/simulations/index.js';
import LayoutSignIn from '@/views/LayoutSignIn';

Vue.use(VueRouter);

// Middleware for pages that do not require authentication.
// If authenticated, the user will be sent to the main route.
const ifNotAuthenticated = (to, from, next) => {
  if (!getters.isAuthenticated()) {
    next();
  } else {
    next('/');
  }
};

// Middleware for pages that require authentication.
// If not authenticated, the user will be sent to the signin page.
const ifAuthenticated = (to, from, next) => {
  if (getters.isAuthenticated()) {
    next();
  } else {
    next('/sign-in');
  }
};

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
      children: labs.map(lab => ({ ...lab, beforeEnter: actions.cleanup }))
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

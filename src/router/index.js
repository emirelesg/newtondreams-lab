import Vue from 'vue';
import VueRouter from 'vue-router';
import { getters } from '@/store/index.js';
import LayoutHome from '@/views/LayoutHome';
import LayoutSignIn from '@/views/LayoutSignIn';
import labs from '@/router/labs';

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

const router = new VueRouter({
  // mode: 'history',
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

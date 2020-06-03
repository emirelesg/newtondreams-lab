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
    name: 'Velocidad',
    path: 'velocidad',
    component: () =>
      import(/* webpackChunkName: "lab.1" */ '@/simulations/01.vue'),
    beforeEnter: actions.cleanup
  },
  {
    name: 'Trabajo',
    path: 'trabajo',
    component: () =>
      import(/* webpackChunkName: "lab.2" */ '@/simulations/02.vue'),
    beforeEnter: actions.cleanup
  },
  {
    name: 'Three Js',
    path: 'three',
    component: () =>
      import(/* webpackChunkName: "lab.3" */ '@/simulations/03.vue'),
    beforeEnter: actions.cleanup
  },
  {
    name: 'Three Js 2',
    path: 'three2',
    component: () =>
      import(/* webpackChunkName: "lab.4" */ '@/simulations/04.vue'),
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

// router.beforeResolve((to, from, next) => {
//   console.log('router.start');
//   next();
// });

// router.afterEach(() => {
//   console.log('router.end');
// });

export default router;

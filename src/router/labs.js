export default [
  {
    name: 'Laboratorio 1',
    path: 'lab-1',
    component: () =>
      import(/* webpackChunkName: "lab.1" */ '@/components/sim1.vue')
  },
  {
    name: 'Laboratorio 2',
    path: 'lab-2',
    component: () =>
      import(/* webpackChunkName: "lab.2" */ '@/components/sim2.vue')
  }
];

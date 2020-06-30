export default [
  {
    name: 'Mediciones',
    path: 'mediciones',
    component: () =>
      import(
        /* webpackChunkName: "lab.mediciones" */ '@/simulations/Mediciones.vue'
      )
  },
  {
    name: 'Movimiento Rectilíneo Uniforme',
    path: 'movimiento_rectilineo_uniforme',
    component: () =>
      import(
        /* webpackChunkName: "lab.movimiento_rectilineo_uniforme" */ '@/simulations/MovimientoRectilineoUniforme.vue'
      )
  },
  {
    name: 'Movimiento Rectilíneo Acelerado',
    path: 'movimiento_rectilineo_acelerado',
    component: () =>
      import(
        /* webpackChunkName: "lab.movimiento_rectilineo_acelerado" */ '@/simulations/MovimientoRectilineoAcelerado.vue'
      )
  },
  {
    name: 'Plano Inclinado',
    path: 'plano_inclinado',
    component: () =>
      import(
        /* webpackChunkName: "lab.plano_inclinado" */ '@/simulations/PlanoInclinado.vue'
      )
  },
  {
    name: 'Tiro Parabólico',
    path: 'tiro_parabólico',
    component: () =>
      import(
        /* webpackChunkName: "lab.tiro_parabolico" */ '@/simulations/TiroParabolico.vue'
      )
  }
];

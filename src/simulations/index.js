// export default [
//   {
//     name: 'Mediciones',
//     path: 'mediciones',
//     component: () =>
//       import(
//         /* webpackChunkName: "lab.mediciones" */ '@/simulations/Mediciones.vue'
//       )
//   },
//   {
//     name: 'Movimiento Rectilíneo Uniforme',
//     path: 'movimiento_rectilineo_uniforme',
//     component: () =>
//       import(
//         /* webpackChunkName: "lab.movimiento_rectilineo_uniforme" */ '@/simulations/MovimientoRectilineoUniforme.vue'
//       )
//   },
//   {
//     name: 'Movimiento Rectilíneo Acelerado',
//     path: 'movimiento_rectilineo_acelerado',
//     component: () =>
//       import(
//         /* webpackChunkName: "lab.movimiento_rectilineo_acelerado" */ '@/simulations/MovimientoRectilineoAcelerado.vue'
//       )
//   },
//   {
//     name: 'Plano Inclinado',
//     path: 'plano_inclinado',
//     component: () =>
//       import(
//         /* webpackChunkName: "lab.plano_inclinado" */ '@/simulations/PlanoInclinado.vue'
//       )
//   },
//   {
//     name: 'Tiro Parabólico',
//     path: 'tiro_parabólico',
//     component: () =>
//       import(
//         /* webpackChunkName: "lab.tiro_parabolico" */ '@/simulations/TiroParabolico.vue'
//       )
//   }
// ];

export default [
  {
    name: 'Mediciones',
    path: 'mediciones',
    component: () =>
      import(/* webpackChunkName: "lab" */ '@/simulations/Mediciones.vue')
  },
  {
    name: 'Movimiento Rectilíneo Uniforme',
    path: 'movimiento_rectilineo_uniforme',
    component: () =>
      import(
        /* webpackChunkName: "lab" */ '@/simulations/MovimientoRectilineoUniforme.vue'
      )
  },
  {
    name: 'Movimiento Rectilíneo Acelerado',
    path: 'movimiento_rectilineo_acelerado',
    component: () =>
      import(
        /* webpackChunkName: "lab" */ '@/simulations/MovimientoRectilineoAcelerado.vue'
      )
  },
  {
    name: 'Plano Inclinado',
    path: 'plano_inclinado',
    component: () =>
      import(/* webpackChunkName: "lab" */ '@/simulations/PlanoInclinado.vue')
  },
  {
    name: 'Tiro Parabólico',
    path: 'tiro_parabólico',
    component: () =>
      import(/* webpackChunkName: "lab" */ '@/simulations/TiroParabolico.vue')
  },
  {
    name: 'Caida Libre',
    path: 'caida_libre',
    component: () =>
      import(/* webpackChunkName: "lab" */ '@/simulations/CaidaLibre.vue')
  },
  {
    name: 'Calorimetría',
    path: 'calorimetria',
    component: () =>
      import(/* webpackChunkName: "lab" */ '@/simulations/Calorimetria.vue')
  },
  {
    name: 'Péndulo Simple',
    path: 'pendulo_simple',
    component: () =>
      import(/* webpackChunkName: "lab" */ '@/simulations/PenduloSimple.vue')
  },
  {
    name: 'Energía',
    path: 'energia',
    component: () =>
      import(/* webpackChunkName: "lab" */ '@/simulations/Energia.vue')
  },
  {
    name: 'Peso Aparente',
    path: 'peso_aparente',
    component: () =>
      import(/* webpackChunkName: "lab" */ '@/simulations/PesoAparente.vue')
  }
];

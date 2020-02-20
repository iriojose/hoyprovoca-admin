import Vue from "vue";
import VueRouter from "vue-router";
//import store from '../store';

import Home from "../views/home/Home.vue";
import Login from '../views/auth/Login';
import NotFound from '../views/errors/NotFound';
import NotAuthorized from '../views/errors/NotAuthorized';
import Dashboard from '../views/dashboard/Dashboard';
import Inventario from '../views/inventario/Inventario';
import Clientes from '../views/clientes/Clientes';
import Empresas from '../views/empresas/Empresas';
import Pedidos from '../views/pedidos/Pedidos';
import Estadisticas from '../views/estadisticas/Estadisticas';
import Pagos from '../views/pagos/Pagos';

import NuevaFactura from '../views/pagos/NuevaFactura';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta:{
      auth:true
    },

    children:[
      {
        path:'dashboard',
        name:'dashboard',
        component:Dashboard
      },
      {
        path:'inventario',
        name:'Inventario',
        component:Inventario
      },
      {
        path:'clientes',
        name:'clientes',
        component:Clientes
      },
      {
        path:'empresas',
        name:'empresas',
        component:Empresas
      },
      {
        path:'pedidos',
        name:'pedidos',
        component:Pedidos
      },
      {
        path:'estadisticas',
        name:'estadisticas',
        component:Estadisticas
      },
      {
        path:'pagos',
        name:'pagos',
        component:Pagos
      }
    ]
  },
  {
    path:"/login",
    name:"login",
    component:Login,
    meta:{
      auth:false
    }
  },
  {
    path:"*",
    name:"notFound",
    component:NotFound
  },
  {
    path:"/notAuthorized",
    name:"notAuthorized",
    component:NotAuthorized
  },
  {
    path:'/nuevaFactura',
    name:'nuevaFactura',
    component:NuevaFactura
  }
];

const router = new VueRouter({
  routes,
  mode: "history",
  base: '/',
  linkActiveClass: 'router-link-active', 
  linkExactActiveClass: 'router-link-exact-active', 
  scrollBehavior(to, from, savedPosition){
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  parseQuery: q => q, 
  fallback: true,
});


/*router.beforeEach((to, from, next) => {
  let user = store.state.user.logged;

  if(to.meta.auth){
    if(user){
      next();
    }else{
      next({name:'notAuthorized'});
    }
  }else{
    next({name:'login'});
  }
});*/

export default router;

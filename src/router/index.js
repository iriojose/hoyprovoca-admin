import Vue from "vue";
import VueRouter from "vue-router";
//import store from '../store';

import Home from "../views/home/Home.vue";

import Login from '../views/auth/Login';
import NotFound from '../views/errors/NotFound';
import NotAuthorized from '../views/errors/NotAuthorized';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta:{
      auth:true
    }
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
  }
];

const router = new VueRouter({
  routes,
  mode: "history",
  base: '/a',
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
  let user=store.state.user.logged;

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

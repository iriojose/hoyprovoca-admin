import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
    {
        path: "/",
        name: "home",
        component:() => import("@/views/home/Home"),
        meta:{
            auth:false
        },
    },
    {
        path:"/dashboard",
        name:"dashboard",
        component: () => import("@/views/dashboard/Dashboard"),
        meta:{
            auth:true
        }
    },
    {
        path:'/usuarios',
        name:"usuarios",
        component:() => import('@/views/usuarios/Usuarios'),
        meta:{
            auth:true
        },
    },
    {
        path:'/pagos',
        name:"pagos",
        component:() => import('@/views/pagos/Pagos'),
        meta:{
            auth:true
        },
    },
    {
        path:'/empresas',
        name:"empresas",
        component:() => import("@/views/empresas/Empresas"),
        meta:{
            auth:true
        },
    },
    {
        path:'/profile',
        name:"profile",
        component:() => import('@/views/account/Profile'),
        meta:{
            auth:true
        },
    },
    {
        path: "/ayuda",
        name: "ayuda",
        component: () => import('@/views/account/Ayuda'),
        meta: {
            auth: true
        }
    },
    {
        path:'/notificaciones',
        name:"notificaciones",
        component: () => import('@/views/account/Notificaciones'),
        meta:{
            auth:true
        },
    },
    {
        path:'/grupos',
        name:"grupos",
        component:() => import('@/views/inventario/Grupos'),
        meta:{
            auth:true
        },
    },
    {
        path:'/subgrupos',
        name:"subgrupos",
        component:() => import('@/views/inventario/Subgrupos'),
        meta:{
            auth:true
        },
    },
    {
        path:'/productos',
        name:"productos",
        component:() => import('@/views/inventario/Productos'),
        meta:{
            auth:true
        },
    },
    {
        path:'/cargos',
        name:"cargos",
        component:() => import('@/views/inventario/Cargos'),
        meta:{
            auth:true
        },
    },
    {
        path: "/login",
        name: "login",
        component:() => import("@/views/auth/Login"),
        meta:{
            auth:false
        }
    },
    {
        path: "/forgot",
        name: "forgot",
        component: () => import("@/views/auth/Forgot"),
        meta:{
            auth:false
        }
    },
];

const router = new Router({
    mode: "history",
    base:'/admin',
    routes,
	linkActiveClass: 'router-link-active', 
    linkExactActiveClass: 'router-link-exact-active', 
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    parseQuery: q => q,
    fallback: true,
});

router.beforeEach((to,from,next) => {
    let user =  window.localStorage.getItem('admin_token');

    if(to.meta.auth){
        if(user !== "" && user){
            next();
        }else{
            next({name:'home'});
        }
    }else{
        if(to.name == 'login' && user !== null){
            next({name:'dashboard'});
        }else if(to.name == 'home' && user !== null){
            next({name:'dashboard'});
        }else if(to.name == 'register' && user !== null){
            next({name:'dashboard'});
        }else if(to.name == 'forgot' && user !== null){
            next({name:'dashboard'});
        }else if(user == null){
            next();
        }
    }
});

export default router;

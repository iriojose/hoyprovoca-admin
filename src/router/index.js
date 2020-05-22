import Vue from "vue";
import Router from "vue-router";
import store from '@/store';

import Home from "@/views/home/Home";
import Login from '@/views/auth/Login';
import Forgot from '@/views/auth/Forgot';
import Usuarios from '@/views/usuarios/Usuarios';
import Empresas from '@/views/empresas/Empresas';
import Pagos from '@/views/pagos/Pagos';
import Grupos from '@/views/inventario/Grupos';
import Cargos from '@/views/inventario/Cargos';
import Subgrupos from '@/views/inventario/Subgrupos';
import Productos from '@/views/inventario/Productos';
import Profile from '@/views/account/Profile';
import Notificaciones from '@/views/account/Notificaciones' 
import NewEmpresa from '@/views/empresas/NewEmpresa';
import NewUsuario from '@/views/usuarios/NewUsuario';
import Tasas from '@/views/inventario/Tasas';

Vue.use(Router);

const router = new Router({
    mode: "history",
	base:'/admin',
	routes:[
		{
			path: "/",
			name: "dashboard",
			component: Home,
			meta:{
                auth:true
            },
            children:[
                {
                    path:'usuarios',
                    name:"usuarios",
                    component:Usuarios,
                    meta:{
                        auth:true
                    },
                    children:[
                        {
                            path:'usuario',
                            name:"nuevousuario",
                            component:NewUsuario,
                            meta:{
                                auth:true
                            },
                        }
                    ]
                },
                {
                    path:'pagos',
                    name:"pagos",
                    component:Pagos,
                    meta:{
                        auth:true
                    },
                },
                {
                    path:'empresas',
                    name:"empresas",
                    component:Empresas,
                    meta:{
                        auth:true
                    },
                    children:[
                        {
                            path:'empresa',
                            name:"nuevoempresa",
                            component:NewEmpresa,
                            meta:{
                                auth:true
                            },
                        }
                    ]
                },
                {
                    path:'profile',
                    name:"profile",
                    component:Profile,
                    meta:{
                        auth:true
                    },
                },
                {
                    path:'notificaciones',
                    name:"notificaciones",
                    component:Notificaciones,
                    meta:{
                        auth:true
                    },
                },
                {
                    path:'grupos',
                    name:"grupos",
                    component:Grupos,
                    meta:{
                        auth:true
                    },
                },
                {
                    path:'subgrupos',
                    name:"subgrupos",
                    component:Subgrupos,
                    meta:{
                        auth:true
                    },
                },
                {
                    path:'productos',
                    name:"productos",
                    component:Productos,
                    meta:{
                        auth:true
                    },
                },
                {
                    path:'cargos',
                    name:"cargos",
                    component:Cargos,
                    meta:{
                        auth:true
                    },
                },
                {
                    path:'tasas',
                    name:"tasas",
                    component:Tasas,
                    meta:{
                        auth:true
                    },
                }
            ]

		},
		{
			path: "/login",
			name: "login",
			component: Login,
			meta:{
                auth:false
            }
        },
        {
			path: "/forgot",
			name: "forgot",
			component: Forgot,
			meta:{
                auth:false
            }
		},
	],
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
    let user = store.state.user.loggedIn;

    if(to.meta.auth){
        if(user){
            next();
        }else{
            next({name:'login'});
        }
    }else{
        if(to.name == 'login' && user){
            next({name:'home'});
        }else if(to.name == 'login' && user){
            next({name:'home'});
        }else if(to.name == 'register' && user){
            next({name:'home'});
        }else if(to.name == 'resetPassword' && user){
            next({name:'home'});
        }else if(to.name == 'forgot' && user){
            next({name:'forgot'});
        }else{
            next();
        }
    }
});

export default router;

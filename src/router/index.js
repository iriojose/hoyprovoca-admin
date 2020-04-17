import Vue from "vue";
import Router from "vue-router";
import store from '@/store';

import Home from "@/views/home/Home";
import Login from '@/views/auth/Login';
import Forgot from '@/views/auth/Forgot';
import Usuarios from '@/views/usuarios/Usuarios';
import Empresas from '@/views/empresas/Empresas';
import Grupos from '@/views/inventario/Grupos';
import Subgrupos from '@/views/inventario/Subgrupos';
import Productos from '@/views/inventario/Productos';
import NewGrupo from '@/views/inventario/NewGrupo';
import NewSubgrupo from '@/views/inventario/NewSubgrupo';
import NewProducto from '@/views/inventario/NewProducto';

Vue.use(Router);

const router = new Router({
    mode: "history",
	base:'/',
	routes:[
		{
			path: "/",
			name: "home",
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
                },
                {
                    path:'empresas',
                    name:"empresas",
                    component:Empresas,
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

                    children:[
                        {
                            path:'grupo',
                            name:"nuevogrupo",
                            component:NewGrupo,
                            meta:{
                                auth:true
                            },
                        }
                    ]
                },
                {
                    path:'subgrupos',
                    name:"subgrupos",
                    component:Subgrupos,
                    meta:{
                        auth:true
                    },

                    children:[
                        {
                            path:'new',
                            name:"nuevosubgrupo",
                            component:NewSubgrupo,
                            meta:{
                                auth:true
                            },
                        }
                    ]
                },
                {
                    path:'productos',
                    name:"productos",
                    component:Productos,
                    meta:{
                        auth:true
                    },

                    children:[
                        {
                            path:'new',
                            name:"nuevoproducto",
                            component:NewProducto,
                            meta:{
                                auth:true
                            },
                        }
                    ]
                },
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
            next({name:'home'});
        }else{
            next();
        }
    }
});

export default router;

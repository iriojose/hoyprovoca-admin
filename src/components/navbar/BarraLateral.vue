<template>
    <div>
        <v-navigation-drawer 
            app width="256" 
            hide-overlay
            class="mx-auto"
            v-model="drawers"
        >
            <v-img
                src="https://cdn.pixabay.com/photo/2020/04/02/07/38/balloon-4993835_960_720.jpg"
                height="100%"
                gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
            >
                <v-list dense nav>
                    <v-list-item two-line>
                        <v-list-item-avatar size="70">
                            <v-img :src="image+user.data.fotografia"></v-img>
                        </v-list-item-avatar>
                        <v-avatar @click="open" class="abs_center" size="35" style="z-index:2;" color="#F5F5F5">
                            <v-icon style="font-size:21px;">mdi-camera</v-icon>
                        </v-avatar>

                        <v-list-item-content class="white--text font-weight-bold">
                            <v-list-item-title v-if="user.data.perfil_id==2">Super usuario</v-list-item-title>
                            <v-list-item-title v-if="user.data.perfil_id==1">Administrador</v-list-item-title>
                            <v-list-item-subtitle class="white--text font-weight-bold">{{user.data.nombre +' '+ user.data.apellido}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-divider class="back"></v-divider>

                <v-list dense nav v-if="user.data.adm_empresa_id == null">
                    <v-list-item 
                        v-for="item in items" 
                        :key="item.title" 
                        link 
                        :to="item.to"
                        active-class="white--text color font-weight-bold sombra"
                    >
                        <v-list-item-icon>
                            <v-icon dark>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="white--text font-weight-bold">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list dense nav v-else>
                    <v-list-item 
                        v-for="item in items2" 
                        :key="item.title" 
                        link 
                        :to="item.to"
                        active-class="white--text color font-weight-bold sombra"
                    >
                        <v-list-item-icon>
                            <v-icon dark>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="white--text font-weight-bold">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-divider class="back"></v-divider>
                
                <v-list dense nav v-if="user.data.adm_empresa_id !== null">
                    <v-list-item 
                        v-for="(item,e) in items4" 
                        :key="e" 
                        link 
                        :to="item.to"
                        active-class="white--text color font-weight-bold sombra"
                    >
                        <v-list-item-icon>
                            <v-icon dark>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="white--text font-weight-bold">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-list dense nav v-else>
                    <v-list-item 
                        v-for="(item,e) in items3" 
                        :key="e" 
                        link 
                        :to="item.to"
                        active-class="white--text color font-weight-bold sombra"
                    >
                        <v-list-item-icon>
                            <v-icon dark>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="white--text font-weight-bold">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-img>
        </v-navigation-drawer>

        <ModalImagen />
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import variables from '@/services/variables_globales';
import ModalImagen from './ModalImagen';

    export default {
        components:{
            ModalImagen
        },
        data() {
            return {
                ...variables,
                items: [
                    { title: 'Dashboard', icon: 'mdi-view-dashboard',to:'/' },
                    { title: 'Perfil', icon: 'mdi-account',to:'/profile' },
                    { title: 'Notificaciones', icon: 'mdi-bell',to:'/notificaciones' },
                    { title: 'Empresas', icon: 'mdi-domain',to:'/empresas' },
                    { title: 'Usuarios', icon: 'mdi-account-circle',to:'/usuarios' },
                    { title: 'Pagos', icon: 'mdi-bank',to:'/pagos' },
                ],
                items2:[
                    { title: 'Dashboard', icon: 'mdi-view-dashboard',to:'/' },
                    { title: 'Perfil', icon: 'mdi-account',to:'/profile' },
                    { title: 'Notificaciones', icon: 'mdi-bell',to:'/notificaciones' },
                ],
                items3:[
                    { title: 'Grupos', icon: 'mdi-account-group',to:'/grupos' },
                    { title: 'Sub grupos', icon: 'mdi-sitemap',to:'/subgrupos' },
                ],
                items4:[
                    { title: 'Grupos', icon: 'mdi-account-group',to:'/grupos' },
                    { title: 'Sub grupos', icon: 'mdi-sitemap',to:'/subgrupos' },
                    { title: 'Productos', icon: 'mdi-food-fork-drink',to:'/productos' },
                    { title: 'Cargos', icon: 'mdi-package-down',to:'/cargos' },
                ]
            }
        },
        computed:{
            ...mapState(['drawer','user']),
            drawers:{
                get(){
                    return this.drawer;
                },
                set(val){
                    this.setDrawer(val);
                }
            }
        },
        methods:{
            ...mapActions(['setDrawer','setModalImagen']),
            open(){
                this.setModalImagen(true);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .abs_center{
        position: absolute;
        top: 50px;
        left: 50px;
    }
    .abs_center:hover{
        cursor: pointer;
        background: #ededed !important;
    }
    .color{
        background: #17468b;
    }
    .back{
        background: #fff;
    }
    .back2{
        background: transparent !important;
    }
    .sombra{
        -webkit-box-shadow: 0px 5px 6px -5px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 5px 6px -5px rgba(0,0,0,0.75);
        box-shadow: 0px 5px 6px -5px rgba(0,0,0,0.75);
    }
</style>
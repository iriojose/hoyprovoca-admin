<template>
    <v-navigation-drawer 
        app width="256" 
        hide-overlay
        class="mx-auto"
        v-model="drawers"
        color="#3b61d1"
    >
            
        <v-row justify="center" class="mt-4">
            <v-img :src="require('@/assets/logo 3.png')" contain width="60" height="60"></v-img>
        </v-row>

        <v-divider class="mt-5 mb-2 back mx-5"></v-divider>

        <v-list dense nav v-if="user.data.adm_empresa_id !== null && user.data.adm_empresa_id !==0">
            <v-list-item 
                v-for="item in items2" :key="item.title" link 
                :to="item.to" class="transition white--text"
                active-class="background color" 
            >
                <v-list-item-icon>
                    <v-icon small :color="$route.path == item.to ? '#3b61d1':'#fff'">
                        {{item.icon}}
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="$route.path == item.to ? 'font-weight-medium color':'font-weight-medium white--text'">
                    {{item.title}}
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list dense nav v-else>
            <v-list-item 
                v-for="item in items" :key="item.title" link 
                :to="item.to" class="transition white--text font-weight-black"
                active-class="font-weight-black background color" 
            >
                <v-list-item-icon>
                    <v-icon small :color="$route.path == item.to ? '#3b61d1':'#fff'">
                        {{item.icon}}
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="$route.path == item.to ? 'font-weight-medium color':'font-weight-medium white--text'">
                    {{item.title}}
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-divider class="mt-5 mb-2 back mx-5"></v-divider>
                
        <v-list dense nav v-if="user.data.adm_empresa_id !== null && user.data.adm_empresa_id !==0">
            <v-list-item 
                v-for="item in items4" :key="item.title" link 
                :to="item.to" class="transition white--text font-weight-black"
                active-class="font-weight-black background color" 
            >
                <v-list-item-icon>
                    <v-icon small :color="$route.path == item.to ? '#3b61d1':'#fff'">
                        {{item.icon}}
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="$route.path == item.to ? 'font-weight-medium color':'font-weight-medium white--text'">
                    {{item.title}}
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list dense nav v-else>
            <v-list-item 
                v-for="item in items3" :key="item.title" link 
                :to="item.to" class="transition white--text font-weight-black"
                active-class="font-weight-black background color" 
            >
                <v-list-item-icon>
                    <v-icon small :color="$route.path == item.to ? '#3b61d1':'#fff'">
                        {{item.icon}}
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="$route.path == item.to ? 'font-weight-medium color':'font-weight-medium white--text'">
                    {{item.title}}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import variables from '@/services/variables_globales';

    export default {
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
                    { title: 'Productos', icon: 'mdi-food-fork-drink',to:'/productos' },
                    { title: 'Cargos', icon: 'mdi-package-down',to:'/cargos' },
                    { title: 'Cambio de tasa', icon:'mdi-currency-usd',to:'/tasas' },
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
            ...mapActions(['setDrawer']),
        }
    }
</script>

<style lang="scss" scoped>
    .transition{
        transition:all 0.3s;
    }
    .transition:hover{
        transform:translateX(15px);
    }
    .back{
        background: rgba(255,255,255,0.3) !important;
    }

    .background{
        background:#fff;
    }
    .color{
        color:#3b61d1;
    }
    
</style>
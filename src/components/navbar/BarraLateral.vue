<template>
    <v-navigation-drawer
        v-model="drawer"
        app
        height="100%"
        width="80"
        :mobile-break-point="900"
    >
        <v-list dense>
            <v-list-item>
                <v-list-item-title>
                    <v-img 
                        width="46" 
                        height="46" 
                        contain 
                        :src="require('@/assets/log2.png')"
                    ></v-img>
                </v-list-item-title>
            </v-list-item>
        </v-list>
        <v-divider/>
        <v-list>
            <v-list-item v-for="(item,i) in items" :key="i" :to="item.path">
                <v-tooltip right open-on-hover>
                    <template v-slot:activator="{ on }">
                         <v-list-item-icon v-on="on">
                            <v-icon>{{item.icon}}</v-icon>
                        </v-list-item-icon>
                    </template>
                    <span>{{item.text}}</span>
                </v-tooltip>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import {mapState, mapActions} from 'vuex';

    export default {
        data(){
            return{
                items:[
                    {icon:"dashboard",text:"Principal",path:"/dashboard"},
                    {icon:"assignment",text:"Inventario",path:"/Inventario"},
                    {icon:"supervisor_account",text:"Clientes",path:"/clientes"},
                    {icon:"business",text:"Empresas",path:"/empresas"},
                    {icon:"shopping_basket",text:"Pedidos",path:"/pedidos"},
                    {icon:"insert_chart",text:"Estadisticas",path:"/estadisticas"},
                    {icon:"notifications",text:"Notificaciones",path:"/notificaciones"}
                ]
            }
        },
        computed: {
            ...mapState(['barraLateral']),

            drawer:{
                get(){
                    return this.barraLateral;
                },
                set(val){
                    this.setBarraLateral(val);
                }
            }
        },
        methods: {
            ...mapActions(['setBarraLateral']),
        },
    }
</script>
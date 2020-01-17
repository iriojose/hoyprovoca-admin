<template>
    <v-navigation-drawer
        v-model="drawer"
        app
        height="100%"
        width="80"
        :mobile-break-point="900"
    >
        <v-list>
            <v-list-item v-for="(item,i) in items" :key="i">
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
                    {icon:"dashboard",text:"Principal"},
                    {icon:"assignment",text:"Agregar"},
                    {icon:"supervisor_account",text:"Usuarios"},
                    {icon:"business",text:"Empresas"},
                    {icon:"shopping_basket",text:"Pedidos"},
                    {icon:"bar_chart",text:"Estadisticas"},
                    {icon:"notifications",text:"Notificaciones"}
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
            ...mapActions(['setBarraLateral'])
        },
    }
</script>
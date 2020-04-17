<template>
    <div>
        <v-row justify="center" align="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2':null">
            <v-col cols="12" md="4" sm="12" v-for="(item,i) in items" :key="i">
                <v-card width="100%" :height="$vuetify.breakpoint.smAndDown ? 100:150" :color="item.color">
                    <v-row justify="space-around" :class="$vuetify.breakpoint.smAndDown ? 'mx-4 py-5':'mx-4 py-10'">
                        <v-icon size="60" dark>    
                            {{item.icon}}
                        </v-icon>
                        <div>
                            <div class="text-center white--text font-weight-bold title">
                                {{item.text}}
                            </div>
                            <div class="text-center white--text font-weight-bold title">
                                {{item.number}}
                            </div>
                        </div>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols="12" md="6" sm="12">
                <v-hover v-slot:default="{hover}">
                    <v-card :elevation="hover ? 5:0" width="100%">
                        <BarChart :pedidos="pedidos" />
                    </v-card>
                </v-hover>
            </v-col>

            <v-col cols="12" md="6" sm="12">
                <v-hover v-slot:default="{hover}">
                    <v-card :elevation="hover ? 5:0" width="100%">
                        <BarChart />
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import Usuario from '@/services/Usuario';
import Pedidos from '@/services/Pedidos';
import Empresa from '@/services/Empresa';
import BarChart from '@/components/charts/BarChart';
import {mapState} from 'vuex';

    export default {
        components:{
            BarChart
        },
        data() {
            return {
                pedidos:[],
                items:[
                    {text:'Clientes',icon:'mdi-account',number:0,color:'#303f9f'},
                    {text:'Pedidos',icon:'mdi-basket',number:0,color:'#00796b'},
                    {text:'Empresas',icon:'mdi-domain',number:0,color:'#455a64'}
                ],
            }
        },
        mounted(){
            this.getUsuarios();
            this.getPedidos();
            this.getEmpresas();
            this.getPedidosFechas();
        },
        computed: {
            ...mapState(['drawer'])
        },
        methods:{
            getUsuarios(){
                Usuario().get("/?limit=1").then((response) => {
                    this.items[0].number = response.data.totalCount;
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidos(){
                Pedidos().get("/?rest_estatus_id=1&limit=1").then((response) => {
                    this.items[1].number = response.data.totalCount;
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidosFechas(){
                Pedidos().get("/?rest_estatus_id=3&after-fecha_in=2020-01-01&before-fecha_in=2020-05-01").then((response) => {
                    this.pedidos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            getEmpresas(){
                Empresa().get("/?limit=1").then((response) => {
                    this.items[2].number = response.data.totalCount;
                }).catch(e => {
                    console.log(e);
                });
            }
        }
    }
</script>
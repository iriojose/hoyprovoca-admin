<template>
    <div>
        <v-row justify="center" align="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2':null" v-if="user.data.adm_empresa_id">
            <v-col cols="12" md="4" sm="12" v-for="(item,i) in items2" :key="i">
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

            <!--v-col cols="12" md="6" sm="12">
                <v-hover v-slot:default="{hover}">
                    <v-card :elevation="hover ? 5:0" width="100%">
                        <BarChart :pedidos="pedidos" />
                    </v-card>
                </v-hover>
            </v-col-->

            <v-col cols="12" md="6" sm="12">
                <v-hover v-slot:default="{hover}">
                    <v-card :elevation="hover ? 5:0" width="100%">
                        <DonutChart />
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
        
        <v-row justify="center" align="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2':null" v-else>
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

            <!--v-col cols="12" md="6" sm="12">
                <v-hover v-slot:default="{hover}">
                    <v-card :elevation="hover ? 5:0" width="100%">
                        <BarChart :pedidos="pedidos" />
                    </v-card>
                </v-hover>
            </v-col-->

            <v-col cols="12" md="6" sm="12">
                <v-hover v-slot:default="{hover}">
                    <v-card :elevation="hover ? 5:0" width="100%">
                        <DonutChart :series="series" v-if="series !== undefined"/>
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
//import BarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import {mapState,mapActions} from 'vuex';

    export default {
        components:{
            //BarChart,
            DonutChart
        },
        watch: {
            pedidos(){
                for (let i = 0; i < this.pedidos.length; i++) {
                    if(this.pedidos[i].rest_estatus_id == 1){
                        this.series[0]+=1;
                    }else if(this.pedidos[i].rest_estatus_id == 2){
                        this.series[1]+=1;
                    }else if(this.pedidos[i].rest_estatus_id == 3){
                        this.series[2]+=1;
                    }
                }
                this.setSeries(this.series);
            }
        },
        data() {
            return {
                series:[0,0,0],
                pedidos:[],
                items:[
                    {text:'Clientes',icon:'mdi-account',number:0,color:'#303f9f'},
                    {text:'Pedidos',icon:'mdi-basket',number:0,color:'#00796b'},
                    {text:'Empresas',icon:'mdi-domain',number:0,color:'#455a64'}
                ],
                items2:[
                    {text:'Clientes',icon:'mdi-account',number:0,color:'#303f9f'},
                    {text:'Pedidos',icon:'mdi-basket',number:0,color:'#00796b'},
                    {text:'Productos',icon:'mdi-food',number:0,color:'#455a64'}
                ],
            }
        },
        mounted(){
            if(this.user.data.adm_empresa_id){
                this.getUsuarios();
                this.getPedidosEmpresas();
                this.getPedidosConceptos();
                this.getPedidosEmpresasEstatus();
            }else{
                this.getUsuarios();
                this.getPedidos();
                this.getEmpresas();
            }
            
        },
        computed: {
            ...mapState(['drawer','user'])
        },
        methods:{
            ...mapActions(['setSeries']),

            getUsuarios(){
                Usuario().get("/?limit=1").then((response) => {
                    this.user.data.adm_empresa_id ? this.items2[0].number = response.data.totalCount:this.items[0].number = response.data.totalCount;
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidos(){
                Pedidos().get("/?fields=id,rest_estatus_id&limit=1000").then((response) => {
                    this.items[1].number = response.data.totalCount;
                    this.pedidos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidosEmpresas(){
                Empresa().get(`/${this.user.data.adm_empresa_id}/pedidos/?limit=1`).then((response) => {
                    this.items2[1].number = response.data.totalCount;
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidosEmpresasEstatus(){
                Empresa().get(`/${this.user.data.adm_empresa_id}/pedidos/?fields=id,rest_estatus_id&limit=1000`).then((response) => {
                    this.pedidos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidosConceptos(){
                Empresa().get(`/${this.user.data.adm_empresa_id}/conceptos/?limit=1`).then((response) => {
                    this.items2[2].number = response.data.totalCount;
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
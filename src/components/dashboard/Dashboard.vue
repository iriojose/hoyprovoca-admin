<template>
    <div>
        <v-row justify="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2':null">
            <v-col cols="12" sm="12" md="3" v-for="(card,i) in cards" :key="i">
                <div class="sombra">
                    <v-card elevation="0">
                        <v-alert
                            border="left"
                            colored-border
                            :color="card.clases"
                            elevation="0" class="sombra"
                        >
                            <v-row :justify="$vuetify.breakpoint.smAndDown ? 'center':null">
                                <v-col cols="9">
                                    <div :class="card.clases">{{card.text}}</div>
                                    <div :class="i == 0 ? 'overline font-weight-black':'subtitle-1 font-weight-black'">{{card.number}}</div>
                                </v-col>
                               
                               <v-col cols="3">
                                   <v-icon size="40" color="grey lighten-2">{{card.icon}}</v-icon>
                               </v-col>
                            </v-row>
                        </v-alert>
                    </v-card>
                </div>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="8" sm="12">
                <ChartLine />
            </v-col>
            <v-col cols="12" md="4" sm="12">
                <ChartDonut />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import ChartDonut from '@/components/charts/ChartDonut';
import ChartLine from '@/components/charts/ChartLine';
import Usuario from '@/services/Usuario';
import Pedidos from '@/services/Pedidos';
import Empresa from '@/services/Empresa';
import Factura from '@/services/Factura';
//import Cambio from '@/services/Cambio';
import accounting from 'accounting';
import {mapActions} from 'vuex';

    export default {
        components:{
            ChartDonut,
            ChartLine
        },
        data() {
            return {
                series:[0,0,0],
                pedidos:[],
                cards:[
                    {id:0,number:'0',clases:'blue--text darken-4 overline',text:'GANANCIAS',icon:'mdi-calendar-blank'},
                    {id:1,number:'0',clases:'green--text darken-4 overline',text:'USUARIOS',icon:'mdi-account-circle'},
                    {id:2,number:'0',clases:'teal--text darken-3 overline',text:'EMPRESAS',icon:'mdi-domain'},
                    {id:3,number:'0',clases:'yellow--text darken-4 overline',text:'PENDIENTES',icon:'mdi-chat'},
                ]
            }
        },
        watch: {
            pedidos(){
                for (let i = 0; i < this.pedidos.length; i++) {
                    if(this.pedidos[i].rest_estatus_id == 1){
                        this.series[0]+=+1;
                    }else if(this.pedidos[i].rest_estatus_id == 2){
                        this.series[1]+=+1;
                    }else if(this.pedidos[i].rest_estatus_id == 3){
                        this.series[2]+=+1;
                    }
                }
                this.cards[3].number = this.series[1];
                this.setSeries(this.series);
            },
        },
        mounted() {
            this.getPedidos();
            this.getEmpresas();
            this.getUsuarios();
            this.getSale();
        },
        methods:{
            ...mapActions(['setSeries']),

            getUsuarios(){//obtiene todos los usuario (funcion del administrador)
                Usuario().get("/?limit=1").then((response) => {
                    this.cards[1].number = response.data.totalCount;
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidos(){//obtiene todos los pedidos (funcion del administrador)
                Pedidos().get("/?fields=id,rest_estatus_id&limit=1000").then((response) => {
                    this.pedidos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            getEmpresas(){//obtiene todas las empresas (funcion administrador)
                Empresa().get("/?limit=1").then((response) => {
                    this.cards[2].number = response.data.totalCount;
                }).catch(e => {
                    console.log(e);
                });
            },
            getSale(){
                Factura().get("/total").then((response) => {
                    this.cards[0].number = accounting.formatMoney(+response.data.data.subtotal,{symbol:"Bs ",thousand:'.',decimal:','});
                }).catch(e => {
                    console.log(e)
                });
            }
        }
    }
</script>

<style lang="scss" scope>
    .sombra{
       /*box-shadow: 0px 0px 50px 20px (173, 185, 201, 0.9);*/
        box-shadow: 0px 0px 35px 5px rgba(173, 185, 201,0.2);
    }
</style>
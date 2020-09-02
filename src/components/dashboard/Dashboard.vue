<template>
    <v-card elevation="0" width="100%" color="transparent">
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="reload()" :loading="loading" class="text-capitalize font-weight-black">
                <v-icon class="mx-2" color="#1f3b63">mdi-reload</v-icon>
                Reload
            </v-btn>
        </v-card-actions>
        
        <v-card-text>
            <v-row justify="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2':null" v-if="user.data.adm_empresa_id == null || user.data.adm_empresa_id == 0">
                <v-col cols="12" sm="12" md="3" v-for="(card,i) in cards" :key="i">
                    <div class="sombre">
                        <v-card elevation="0">
                            <v-alert
                                border="left"
                                colored-border
                                :color="card.clases"
                                elevation="0"
                            >
                                <v-row :justify="$vuetify.breakpoint.smAndDown ? 'center':null" v-if="!loading">
                                    <v-col cols="9">
                                        <div :class="card.clases">{{card.text}}</div>
                                        <div :class="i == 0 ? 'subtitle-1 font-weight-black':'subtitle-1 font-weight-black'">{{card.number}}</div>
                                    </v-col>
                                
                                <v-col cols="3">
                                    <v-icon size="40" color="grey lighten-2">{{card.icon}}</v-icon>
                                </v-col>
                                </v-row>
                                <v-row v-else justify="center">
                                    <Puntos />
                                </v-row>
                            </v-alert>
                        </v-card>
                    </div>
                </v-col>
            </v-row>

            <v-row justify="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2':null" v-else>
                <v-col cols="12" sm="12" md="3" v-for="(card,i) in cards1" :key="i">
                    <div class="sombre">
                        <v-card elevation="0">
                            <v-alert
                                border="left"
                                colored-border
                                :color="card.clases"
                                elevation="0"
                            >
                                <v-row :justify="$vuetify.breakpoint.smAndDown ? 'center':null" v-if="!loading">
                                    <v-col cols="9">
                                        <div :class="card.clases">{{card.text}}</div>
                                        <div :class="i == 0 ? 'subtitle-1 font-weight-black':'subtitle-1 font-weight-black'">{{card.number}}</div>
                                    </v-col>
                                
                                <v-col cols="3">
                                    <v-icon size="40" color="grey lighten-2">{{card.icon}}</v-icon>
                                </v-col>
                                </v-row>
                                <v-row v-else justify="center">
                                    <Puntos />
                                </v-row>
                            </v-alert>
                        </v-card>
                    </div>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12" md="7" sm="12">
                    <ChartDonut />
                </v-col>
                <v-col cols="12" md="5" sm="12">
                    <CardTasa />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import ChartDonut from '@/components/charts/ChartDonut';
import Puntos from '@/components/loaders/Puntos';
import Usuario from '@/services/Usuario';
import Pedidos from '@/services/Pedidos';
import Empresa from '@/services/Empresa';
import Factura from '@/services/Factura';
import Vendedores from '@/services/Vendedores';
import CardTasa from '@/components/cards/CardTasa';
import accounting from 'accounting';
import {mapActions,mapState} from 'vuex';

    export default {
        components:{
            ChartDonut,
            Puntos,
            CardTasa
        },
        data() {
            return {
                series:[0,0,0],
                loading:false,
                pedidos:[],
                cards:[
                    {id:0,number:'0',clases:'blue--text darken-4 ',text:'GANANCIAS',icon:'mdi-calendar-blank'},
                    {id:1,number:'0',clases:'green--text darken-4 ',text:'USUARIOS',icon:'mdi-account-circle'},
                    {id:2,number:'0',clases:'teal--text darken-4 ',text:'EMPRESAS',icon:'mdi-domain'},
                    {id:3,number:'0',clases:'yellow--text darken-4 ',text:'PENDIENTES',icon:'mdi-chat'},
                ],
                cards1:[
                    {id:0,number:'0',clases:'blue--text darken-4 ',text:'VENTAS',icon:'mdi-calendar-blank'},
                    {id:1,number:'0',clases:'green--text darken-4 ',text:'PRODUCTOS',icon:'mdi-food'},
                    {id:2,number:'0',clases:'teal--text darken-4 ',text:'GANANCIAS',icon:'mdi-cash'},
                    {id:2,number:'0',clases:'yellow--text darken-4 ',text:'PENDIENTES',icon:'mdi-chat'},
                ]
            }
        },
        mounted() {
            let series = JSON.parse(window.localStorage.getItem('series'));
            let cards = JSON.parse(window.localStorage.getItem('cards'));

            if (cards && series){
                this.setSeries(series);
                if(this.user.data.adm_empresa_id == null || this.user.data.adm_empresa_id == 0) this.cards = cards
                else this.cards1 = cards;
            }else this.init();
        },
        computed: {
            ...mapState(['user'])
        },
        methods:{
            ...mapActions(['setSeries']),

            reload(){
                this.init();
            },
            init(){
                this.loading = true;
                if(this.user.data.adm_empresa_id == null || this.user.data.adm_empresa_id == 0) this.getUsuarios();
                else this.getSeller();
            },
            //Administradores
            async getUsuarios(){//obtiene todos los usuario (funcion del administrador)
                await Usuario().get("/?limit=1").then((response) => {
                    this.cards[1].number = response.data.totalCount;
                    this.getEmpresas();
                }).catch(e => {
                    console.log(e);
                });
            },
            async getEmpresas(){//obtiene todas las empresas (funcion administrador)
                await Empresa().get("/?limit=1").then((response) => {
                    this.cards[2].number = response.data.totalCount;
                    this.getSale();
                }).catch(e => {
                    console.log(e);
                });
            },
            async getSale(){
                await Factura().get(`/total/?limit=67010&after-fecha_at=2018-01-01&before-fecha_at=2020-01-01`).then((response) => {
                    console.log(response);
                    if (response.data.data[0].subtotal !== null) this.cards[0].number = accounting.formatMoney(+response.data.data[0].subtotal,{symbol:"Bs ",thousand:'.',decimal:','});
                    else this.cards[0].number = accounting.formatMoney(+this.cards[0].number,{symbol:"Bs ",thousand:'.',decimal:','});
                    this.getStats();
                }).catch(e => {
                    console.log(e)
                });
            },
            async getStats(){//obtiene todos los pedidos (funcion del administrador)
                await Pedidos().get("/stats").then((response) => {
                    if(response.data){
                        this.series[0]=response.data.statusNuevo;
                        this.series[1]=response.data.statusPorFacturar;
                        this.series[2]=response.data.statusFacturado;
                        this.cards[3].number = this.series[1];
                        this.setSeries(this.series);
                        window.localStorage.setItem('series',JSON.stringify(this.series));
                        window.localStorage.setItem('cards',JSON.stringify(this.cards));
                    }else {
                        this.series[0]=1;
                        this.series[1]=1;
                        this.series[2]=1;
                        this.cards[3].number = 0;
                        this.setSeries(this.series);
                        window.localStorage.setItem('series',JSON.stringify(this.series));
                        window.localStorage.setItem('cards',JSON.stringify(this.cards));
                    }
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            //Super Usuario
            async getSeller(){
                Vendedores().get(`/?adm_empresa_id=${this.user.data.adm_empresa_id}`).then((response) => {
                    this.getSellerBySell(response.data.data[0].id);
                }).catch(e => {
                    console.log(e);
                });
            },
            async getSellerBySell(id){
                Vendedores().get(`/${id}/sell`).then((response) => {
                    this.cards1[2].number = accounting.formatMoney(+response.data.total_ventas,{symbol:"Bs ",thousand:'.',decimal:','});
                    this.cards1[0].number = response.data.ventas;
                    this.getProductos();
                }).catch(e => {
                    console.log(e);
                });
            },
            async getProductos(){
                await Empresa().get(`/${this.user.data.adm_empresa_id}/conceptos/?limit=1`).then((response) => {
                    this.cards1[1].number = response.data.totalCount;
                    this.getPedidos();
                }).catch(e => {
                    console.log(e);
                });
            },
            async getPedidos(){
                await Empresa().get(`/${this.user.data.adm_empresa_id}/pedidos/?limit=500`).then((response) => {
                    this.processPedidos(response.data.data);
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            processPedidos(pedidos){
                let series = [0,0,0];
                if(pedidos){
                    for (let i = 0; i < pedidos.length; i++) {
                        if(pedidos[i].rest_estatus_id == 1) series[0] +=1;
                        if(pedidos[i].rest_estatus_id == 2) series[1] +=1;
                        if(pedidos[i].rest_estatus_id == 2) series[2] +=1;
                    }
                }
                this.setSeries(series);
                window.localStorage.setItem('series',JSON.stringify(series));
                window.localStorage.setItem('cards',JSON.stringify(this.cards1));
            },
        }
    }
</script>

<style lang="scss" scoped>
    .sombre{
       /*box-shadow: 0px 0px 50px 20px (173, 185, 201, 0.9);*/
        box-shadow: 0px 0px 35px 5px rgba(173, 185, 201,0.2);
    }
</style>
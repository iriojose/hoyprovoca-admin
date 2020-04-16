<template>
    <div>
        <v-row justify="center" align="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2 mt-12':null">
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
        </v-row>
    </div>
</template>

<script>
import Usuario from '@/services/Usuario';
import Pedidos from '@/services/Pedidos';
import Empresa from '@/services/Empresa';
import {mapState} from 'vuex';

    export default {
        data() {
            return {
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
        },
        computed: {
            ...mapState(['drawer'])
        },
        methods:{
            getUsuarios(){
                Usuario().get("/?limit=1").then((response) => {
                    console.log(response);
                    this.items[0].number = response.data.totalCount;
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidos(){
                Pedidos().get("/?rest_estatus_id=1&limit=1").then((response) => {
                    this.items[1].number = response.data.totalCount;
                    console.log(response);
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
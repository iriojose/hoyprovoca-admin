<template>
    <v-dialog v-model="dialog" width="500" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                <v-spacer></v-spacer>
                Procesar pago
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <!-- mensajes -->
                <v-card elevation="0" height="50" class="mt-5" v-if="loading || showMessage">
                    <v-scroll-x-transition>
                        <v-alert border="left" colored-border elevation="2"  dense :type="type" v-show="showMessage">
                            {{mensaje}}
                        </v-alert>
                    </v-scroll-x-transition> 
                </v-card>

                <v-row justify="center" v-if="loading">
                    <LoaderRect />
                </v-row>

                <v-row v-else justify="center">
                    <v-col cols="12" md="10" sm="12">
                        <v-row justify="center">
                            <v-expansion-panels>
                                <v-expansion-panel>
                                    <v-expansion-panel-header>Cliente</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <ListCliente :usuario="usuario" />
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-expansion-panel>
                                    <v-expansion-panel-header>Vendedor</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <ListVendedor :empresa="empresa" />
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-expansion-panel>
                                    <v-expansion-panel-header>Productos</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <ListProductos :productos="conceptos" />
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-expansion-panel>
                                    <v-expansion-panel-header>Pagos</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <ListPagos :pagos="pagos" />
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="close"></slot>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    :loading="loading"
                >
                    Facturar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Clientes from '@/services/Clientes';
import Usuario from '@/services/Usuario';
import Empresa from '@/services/Empresa';
import Pedidos from '@/services/Pedidos';
import Factura from '@/services/Factura';
import Vendedores from '@/services/Vendedores';
import LoaderRect from '@/components/loaders/LoaderRect';
import ListVendedor from '@/components/lists/ListVendedor';
import ListCliente from '@/components/lists/ListCliente';
import ListProductos from '@/components/lists/ListProductos';
import ListPagos from '@/components/lists/ListPagos';

    export default {
        components:{
            LoaderRect,
            ListVendedor,
            ListCliente,
            ListProductos,
            ListPagos
        },
        props:{
            dialog:{
                type:Boolean,
                default:false
            },
        },
        data() {
            return {
                pagos:[],
                mensaje:'',
                type:'error',
                loading:false,
                showMessage:false,
                usuario:{
                    imagen:'default.png'
                },
                empresa:{
                    imagen:'default.png'
                },
                cliente:{},
                vendedor:{},
                conceptos:[],
            }
        },
        watch: {
            dialog(){
                if(this.dialog) this.init();
                else this.reset();
            }
        },
        methods: {
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type;
                this.loading = false;
                this.showMessage = true;
            },
            init(){
                this.loading = true;
                this.getUsuario();
            },
            reset(){
                this.showMessage = false;
                this.pagos = [];
                this.empresa = {
                    imagen:'default.png'
                };
                this.usuario = {
                    imagen:'default.png'
                };
                this.cliente = {};
                this.vendedor = {};
                this.conceptos = [];
            },
            getUsuario(){
                Usuario().get(`/${this.$parent.bandera.usuario_id}`).then((response) => {
                    this.usuario = response.data.data;
                    this.getCliente();
                }).catch(e => {
                    console.log(e);
                });
            },
            getCliente(){
                Clientes().get(`/?usuario_id=${this.usuario.id}&fields=id,nombre,imagen`).then((response) => {
                    this.cliente = response.data.data[0];
                    this.getEmpresa();
                }).catch(e => {
                    console.log(e);
                });
            },
            getEmpresa(){
                Empresa().get(`/${this.$parent.bandera.adm_empresa_id}`).then((response) => {
                    this.empresa = response.data.data;
                    this.getVendedor();
                }).catch(e => {
                    console.log(e);
                });
            },
            getVendedor(){
                Vendedores().get(`/?adm_empresa_id=${this.empresa.id}&fields=id,nombre,imagen`).then((response) => {
                    this.vendedor = response.data.data[0];
                    this.getPagos();
                }).catch(e => {
                    console.log(e);
                });
            },
            getPagos(){
                Pedidos().get(`/${this.$parent.bandera.id}/pagos`).then((response) => {
                    this.pagos = response.data.data;
                    console.log(this.pagos);
                    this.getConceptos();
                }).catch(e => {
                    console.log(e);
                });
            },
            getConceptos(){
                Pedidos().get(`/${this.$parent.bandera.id}/conceptos/?fields=id,nombre,imagen`).then((response) => {
                    this.conceptos = response.data.data;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            updatePedido(){
                Pedidos().post(`/${this.$parent.bandera.id}`,{data:{rest_estatus_id:3}});
            },
            postFactura(){
                Factura().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.updatePedidos();
                }).catch(e => {
                    console.log(e);
                });
            }

        },
    }
</script>

<style lang="scss" scoped>
    .fondo{
        background: #1f3b63;
    }
</style>
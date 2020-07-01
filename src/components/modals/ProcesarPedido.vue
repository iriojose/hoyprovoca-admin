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

                <v-row justify="center" v-if="loading" class="mb-10">
                    <LoaderRect />
                </v-row>

                <v-stepper v-model="e1" class="elevation-0" non-linear v-else>
                    <v-stepper-header class="elevation-0">
                        <v-stepper-step color="#2950c3" step="1" editable>Cliente</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step color="#2950c3" step="2" editable>Vendedor</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step color="#2950c3" step="3" editable>Productos</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step color="#2950c3" step="4" editable>Pagos</v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <ListCliente :usuario="usuario" />
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <ListVendedor :empresa="empresa" />
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <ListProductos :productos="conceptos" />
                        </v-stepper-content>
                        <v-stepper-content step="4">
                            <ListPagos :pagos="pagos" />
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
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
                e1:1,
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
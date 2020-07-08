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

                <v-row justify="center" v-if="loading2" class="mb-10">
                    <LoaderRect />
                </v-row>

                <v-stepper v-model="e1" class="elevation-0" non-linear v-else>
                    <v-stepper-header class="elevation-0">
                        <v-stepper-step color="#2950c3" step="1" editable>Cliente</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step color="#2950c3" step="2" editable>Vendedor</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step color="#2950c3" step="3" editable>Pagos</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step color="#2950c3" step="4" editable>Repartidores</v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <ListCliente :usuario="usuario" />
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <ListVendedor :empresa="empresa" />
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <ListPagos :pagos="pagos" />
                            <!--ListProductos :productos="conceptos" :detalles="$parent.bandera.detalles" /-->
                        </v-stepper-content>
                        <v-stepper-content step="4">
                            <v-select
                                dense filled single-line
                                rounded label="Repartidor"
                                hint="Asignar pedido" persistent-hint
                                color="#2950c3" :disabled="loading"
                                :rules="[requiredObject('Repartidor')]" return-object
                                :items="repartidores"
                                item-text="nombre" v-model="repartidor"
                            >
                                <template slot="item" slot-scope="{ item }">
                                    <v-avatar size="40" class="mr-5">
                                        <v-img :src="image+item.imagen"></v-img>
                                    </v-avatar>  
                                    {{ item.nombre+' '+item.apellido}} 
                                </template>
                                <template v-slot:selection="{item}">
                                    <v-avatar size="30" class="mr-5">
                                        <v-img :src="image+item.imagen"></v-img>
                                    </v-avatar>  
                                    <span>{{ item.nombre+' '+item.apellido}}</span>
                                </template>
                            </v-select>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-card-text>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="close"></slot>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    :loading="loading" @click="generarFactura()"
                    :disabled="loading2 && repartidor !== null"
                >
                    Aceptar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapState} from 'vuex';
import variables from '@/services/variables_globales';
import validations from '@/validations/validations';
import Clientes from '@/services/Clientes';
import Nots from '@/services/Nots';
import Usuario from '@/services/Usuario';
import Empresa from '@/services/Empresa';
import Pedidos from '@/services/Pedidos';
import Factura from '@/services/Factura';
import Vendedores from '@/services/Vendedores';
import LoaderRect from '@/components/loaders/LoaderRect';
import ListVendedor from '@/components/lists/ListVendedor';
import ListCliente from '@/components/lists/ListCliente';
//import ListProductos from '@/components/lists/ListProductos';
import ListPagos from '@/components/lists/ListPagos';
import { v4 as uuidv4 } from 'uuid';

    export default {
        components:{
            LoaderRect,
            ListVendedor,
            ListCliente,
            //ListProductos,
            ListPagos
        },
        props:{
            dialog:{
                type:Boolean,
                default:false
            },
            tasa:{
                type:Number,
                default:0
            },
            repartidores:{
                type:Array,
                default:() => ([])
            }
        },
        data() {
            return {
                ...variables,
                ...validations,
                e1:1,
                pagos:[],
                repartidor:null,
                mensaje:'',
                type:'error',
                loading:false,
                loading2:false,
                showMessage:false,
                usuario:{
                    imagen:'default.png'
                },
                empresa:{
                    imagen:'default.png'
                },
                cliente:{},
                vendedor:{},
                //conceptos:[],
                data:{
                    fecha_at:new Date().toISOString().substr(0, 10),
                    fecha_in:new Date().toISOString().substr(0, 10),
                    adm_vendedor_id:null,
                    adm_clientes_id:null,
                    subtotal:0,
                    subtotal_dolar:0,
                    estatus_pago:1,
                    adm_tipos_facturas_id:1,
                    rest_pedidos_id: null,
                    iva:0,
                    facturado:1,
                    adm_usuarios_id:0,
                    adm_caja_id:1,
                    devuelto:0
                },
                data1:[]
            }
        },
        computed:{
            ...mapState(['user'])
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
                this.loading2 = true;
                this.getCliente();
            },
            reset(){
                this.showMessage = false;
                this.repartidor = {};
                this.pagos = [];
                this.empresa = {
                    imagen:'default.png'
                };
                this.usuario = {
                    imagen:'default.png'
                };
                this.cliente = {};
                this.vendedor = {};
                //this.conceptos = [];
                this.data1 = [];
            },
            getCliente(){
                Clientes().get(`/${this.$parent.bandera.adm_clientes_id}`).then((response) => {
                    this.cliente = response.data.data;
                    this.getUsuario();
                }).catch(e => {
                    console.log(e);
                });
            },
            getUsuario(){
                Usuario().get(`/${this.cliente.usuario_id}`).then((response) => {
                    this.usuario = response.data.data;
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
                    this.loading2 = false;
                    //this.getConceptos();
                }).catch(e => {
                    console.log(e);
                });
            },
            /*getConceptos(){
                Pedidos().get(`/${this.$parent.bandera.id}/conceptos/?fields=id,nombre,imagen`).then((response) => {
                    this.conceptos = response.data.data;
                    this.loading2 = false;
                }).catch(e => {
                    console.log(e);
                });
            },*/
            updatePedido(){
                Pedidos().post(`/${this.$parent.bandera.id}`,{data:{rest_estatus_id:3,usuario_id:this.repartidor.id}}).then(() => {
                    this.sendNots();
                    this.$parent.bandera.estatus = "Verificado";
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al facturar.","error");
                });
            },
            generarFactura(){
                this.data.numero_factura = uuidv4();
                this.data.adm_vendedor_id = this.vendedor.id;
                this.data.adm_clientes_id = this.cliente.id;
                this.data.rest_pedidos_id = this.$parent.bandera.id;
                this.pagos.filter(a => this.data.subtotal += Number.parseInt(a.monto));
                this.data.subtotal_dolar = this.data.subtotal / this.tasa;
                this.data.subtotal_dolar = this.data.subtotal_dolar.toFixed(2);
                this.data.adm_usuarios_id = this.user.data.id;

                for (let i = 0; i < this.$parent.bandera.detalles.length; i++) {
                    this.data1.push({
                        adm_conceptos_id:this.$parent.bandera.detalles[i].adm_conceptos_id,
                        adm_vendedor_id:this.vendedor.id,
                        precio:this.$parent.bandera.detalles[i].precio,
                        precio_dolar:(this.$parent.bandera.detalles[i].precio/this.tasa).toFixed(2),
                        cantidad:this.$parent.bandera.detalles[i].cantidad,
                        fecha_at:new Date().toISOString().substr(0, 10),
                    });
                }
                this.postFactura();
            },
            postFactura(){
                this.loading = true;
                console.log(this.data,this.data1);
                Factura().post("/",{data:this.data,data1:this.data1}).then(() => {
                    this.updatePedido();
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al facturar.","error");
                });
            },
            sendNots(){
                let data = {
                    link:"https://hoyprovoca.com/account/soporte",
                    subject:"Pedido verificado",
                    type:"any",
                    email:this.usuario.email,
                    message:`Su pedido fue verificado exitosamente, numero de factura:${this.data.numero_factura}, \n,Dentro de unas horas el repartidor se comunicara con usted por el chat de Atención al cliente,\n al cual puede ingresar entrando en ajustes, Atención al cliente.`
                };
                this.loading = true;
                Nots().post("/mail/sendmail",{data:data}).then(() => {
                    this.loading = false;
                    this.respuesta("Facturado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al facturar.","error");
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .fondo{
        background: #1f3b63;
    }
</style>
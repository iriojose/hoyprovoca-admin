<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Crear Cargo
                <v-spacer></v-spacer>
                <!-- boton de salir -->
                <v-scroll-x-transition>
                    <slot name="salir" v-if="showMessage && !loading"></slot>
                </v-scroll-x-transition>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <!-- mensajes -->
                <v-card elevation="0" height="50" class="mt-5">
                    <v-scroll-x-transition>
                        <v-alert border="left" colored-border elevation="2"  dense :type="type" v-show="showMessage">
                            {{mensaje}}
                        </v-alert>
                    </v-scroll-x-transition> 
                </v-card>

                <!-- formulario-->
                <v-form v-model="valid" @submit.prevent="" class="my-5" v-if="!showMessage">

                    <!--Select para Productos -->
                    <v-select
                        dense filled single-line
                        rounded label="Producto"
                        hint="Producto" persistent-hint
                        color="#2950c3" :disabled="loading"
                        :rules="[requiredObject('Producto')]" return-object
                        @change="changeConcepto($event)" :items="conceptos"
                        item-text="nombre" v-model="concepto"
                    >
                        <template v-slot:append-item>
                            <v-row justify="center">
                                <v-btn 
                                    @click="getConceptos()" tile 
                                    color="#232323" :loading="loading"
                                    :disabled="bloqueado"
                                    class="white--text text-capitalize font-weight-bold"
                                >Ver más</v-btn>
                            </v-row>
                        </template>
                        <template slot="item" slot-scope="{ item }">
                            <v-avatar size="40" class="mr-5">
                                <v-img :src="image+item.imagen"></v-img>
                            </v-avatar>  
                            {{ item.nombre }} 
                        </template>
                        <template v-slot:selection="{item}">
                            <v-avatar size="30" class="mr-5">
                                <v-img :src="image+item.imagen"></v-img>
                            </v-avatar>  
                            <span>{{ item.nombre }}</span>
                        </template>
                    </v-select>

                    <v-text-field
                        dense label="cantidad"
                        hint="Numero positivos mayores a 0"
                        filled rounded color="#2950c3" persistent-hint
                        v-model="data.cantidad" single-line
                        :rules="[required('Cantidad'), positivo('Cantidad')]"
                    ></v-text-field>
                </v-form>
            </v-card-text>

            <!-- botones de acciones -->
            <v-card-actions v-if="!showMessage">
                <v-spacer></v-spacer>
                <slot name="close" v-if="!loading"></slot>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="postCargo" :loading="loading"
                    :disabled="!valid"
                >
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Empresa from '@/services/Empresa';
import Cargos from '@/services/Cargos';
import {mapState} from 'vuex';

    export default {
        props:{
            dialog:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                ...validations,
                ...variables,
                type:'error',
                showMessage:false,
                mensaje:'',
                valid:false,
                loading:false,
                data:{
                    cantidad:null,
                    adm_conceptos_id:null,
                    usuario_id:null,
                    adm_depositos_id: 1,
                    adm_empresa_id:null
                },
                //para select de productos
                conceptos:[],
                concepto:null,
                offset:0,
                total:0,
            }
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
            }
        },
        computed:{
            ...mapState(['user']),

            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.conceptos.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            this.init();
            this.addProductos();
        },
        methods:{
            init(){
                this.data.usuario_id = this.user.data.id;
                this.data.adm_empresa_id = this.user.data.adm_empresa_id;
            },
            addProductos(){
                let data = JSON.parse(window.localStorage.getItem('productos'));

                if(data) {
                    this.conceptos = data.productos;
                    this.total = data.total;
                    this.offset = data.offset;
                }else this.getConceptos();
            },
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
            },
            reset(){
                this.showMessage = false;
                this.data.adm_conceptos_id = null;
                this.data.cantidad = null;
                this.concepto = null;
            },
            postCargo(){
                this.loading = true;
                Cargos().post("/",{data:this.data}).then(() => {
                    this.$parent.creado = true;
                    this.$parent.bandera = this.data;
                    this.$parent.bandera.concepto = this.concepto;
                    this.$parent.bandera.fecha_at = new Date().toISOString().substr(0, 10);
                    this.$parent.bandera.usuario = this.user.data.nombre + " " + this.user.data.apellido;
                    this.respuesta("Cargo creado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al crear el cargo.","error");
                });
            },
            getConceptos(id){
                this.loading = true;
                Empresa().get(`/${id}/conceptos/?fields=id,imagen,nombre&limit=50&offset=${this.offset}&order=desc`).then((response) => {
                    response.data.data.filter(a => this.conceptos.push(a));
                    this.offset+=50;
                    this.total= response.data.totalCount;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            changeConcepto(evt){
                this.data.adm_conceptos_id = evt.id;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .fondo{
        background: #1f3b63;
    }
</style>
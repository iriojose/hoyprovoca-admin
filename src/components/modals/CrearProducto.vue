<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Crear Producto
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
                    <v-stepper v-model="e1" class="elevation-0" non-linear>
                        <v-stepper-header class="elevation-0">
                            <v-stepper-step color="#2950c3" step="1" editable></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step color="#2950c3" step="2" editable></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step color="#2950c3" step="3" editable></v-stepper-step>
                        </v-stepper-header>

                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <v-text-field
                                    filled single-line
                                    label="Nombre" dense
                                    rounded hint="Nombre"
                                    :rules="[required('Nombre')]"
                                    v-model="data.nombre" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Codigo" dense
                                    rounded hint="Codigo"
                                    :rules="[required('Codigo')]"
                                    v-model="data.codigo" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Referencia" dense
                                    rounded hint="Referencia"
                                    :rules="[required('Referencia')]"
                                    v-model="data.referencia" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-textarea
                                    filled single-line
                                    label="Descripción" dense
                                    rounded hint="Descripción"
                                    :rules="[required('Descripción')]"
                                    v-model="data.descripcion" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                >
                                </v-textarea>
                            </v-stepper-content>
                            <v-stepper-content step="2">

                                <!--Select para grupo -->
                                <v-select
                                    dense filled single-line
                                    rounded label="Grupo"
                                    hint="Categorías de productos" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    :rules="[requiredObject('Grupo')]" return-object
                                    @change="changeGrupo($event)" :items="grupos"
                                    item-text="nombre" v-model="grupo"
                                >
                                    <template v-slot:append-item>
                                        <v-row justify="center">
                                            <v-btn 
                                                @click="getGrupos()" tile 
                                                color="#232323" :loading="loading2"
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

                                <!--Select para subgrupo -->
                                <v-select
                                    dense filled single-line
                                    rounded label="Subgrupo"
                                    hint="Sub Categorías de productos" persistent-hint
                                    color="#2950c3" :disabled="loading && grupo == null ? true:false"
                                    return-object @change="changeSubgrupo($event)" :items="subgrupos"
                                    item-text="nombre" v-model="subgrupo"
                                >
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
                            </v-stepper-content>
                            
                            <v-stepper-content step="3">

                                <v-text-field
                                    filled single-line
                                    label="Precio" dense
                                    rounded hint="Bs."
                                    :rules="[required('Precio'),positivo('Precio')]"
                                    v-model="data.precio_a" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    @input="changeBolivar"
                                ></v-text-field>
                            
                                <v-text-field
                                    filled single-line
                                    label="Precio" dense
                                    rounded hint="$"
                                    :rules="[required('Precio dolar'),positivo('Precio dolar')]"
                                    v-model="data.precio_dolar" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    @input="changeDolar"
                                ></v-text-field>

                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-form>

                <!-- Agregar imagen -->
                <v-scroll-x-transition>
                    <div v-show="$parent.creado" class="text-center font-weight-black my-4">
                        ¿ Agregar una imagen?
                    </div>
                </v-scroll-x-transition>

                <v-scroll-x-transition>
                    <FilePond  
                        v-show="$parent.creado"
                        ref="pond"
                        label-idle="Arrastrar imagen aquí..."
                        labelFileAdded = "Archivo Añadido"
                        :server="{process}"
                        :onaddfilestart="initProcess"
                    />
                </v-scroll-x-transition>
            </v-card-text>

            <!-- botones de acciones -->
            <v-card-actions v-if="!showMessage">
                <v-spacer></v-spacer>
                <slot name="close" v-if="!loading"></slot>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="postConcepto" :loading="loading"
                    :disabled="!valid"
                >
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>      
</template>

<script>
import Conceptos from '@/services/Conceptos';
import Grupos from '@/services/Grupos';
import Cambio from '@/services/Cambio';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';
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
                tasa:null,
                e1:1,
                ...variables,
                ...validations,
                type:'error',
                showMessage:false,
                mensaje:'',
                valid:false,
                loading:false,
                data:{
                    nombre:'',
                    codigo:'',
                    referencia:'',
                    descripcion:'',
                    adm_grupos_id:null,
                    adm_subgrupos_id:null,
                    adm_empresa_id:null,
                    adm_tipos_conceptos_id:2,
                    precio_a:null,
                    precio_dolar:null,
                    imagen:'default.png',
                },
                //para select de grupos
                grupos:[],
                grupo:null,
                total:0,
                offset:0,
                //para select de subgrupos
                subgrupos:[],
                subgrupo:null,
                //loadings
                loading2:false,
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
                if(this.grupos.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            this.data.adm_empresa_id = this.user.data.adm_empresa_id;
            this.getGrupos();
            this.getCambio();
        },
        methods:{
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
            },
            reset(){
                this.showMessage = false;
                this.data.nombre = "";
                this.data.codigo = "";
                this.data.referencia = "";
                this.data.descripcion = "";
                this.data.precio_a = null;
                this.data.precio_dolar = null;
                this.data.adm_grupos_id = null;
                this.data.adm_subgrupos_id = null;
                this.grupo = null;
                this.subgrupo = null;
            },
            changeGrupo(evt){
                this.grupo = evt;
                this.data.adm_grupos_id = evt.id;
                this.subgrupo = null;
                this.data.adm_subgrupos_id = null;
                this.subgrupos = evt.subgrupos;
            },
            changeSubgrupo(evt){
                this.subgrupo = evt;
                this.data.adm_subgrupos_id = evt.id;
            },
            changeBolivar(){
                this.data.precio_dolar = this.data.precio_a / this.tasa;
                this.data.precio_dolar = this.data.precio_dolar.toFixed(2);
            },
            changeDolar(){
                this.data.precio_a = this.tasa * this.data.precio_dolar
                this.data.precio_a = this.data.precio_a.toFixed(2);
            },
            getGrupos(){
                Grupos().get(`/?offset=${this.offset}&order=desc&fields=subgrupos`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            postConcepto(){
                this.loading = true;
                Conceptos().post("/",{data:this.data}).then((response) => {
                    this.$parent.creado = true;
                    this.$parent.bandera = concepto;
                    this.$parent.bandera.grupo = this.grupo;
                    this.$parent.bandera.subgrupo = this.subgrupo;
                    let data = {existencia:0,};
                    this.$parent.bandera.existencias = [data];
                    this.respuesta("Producto creado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al crear el Concepto.","error");
                });
            },
            initProcess(){
                this.loading = true;
            },
            getCambio(){
                Cambio().get(`/`).then((response) => {
                    this.tasa = response.data.data[0].tasa;
                });
            },
            //metadata, load, error, progress,fieldName, 
            process(fieldName, file, metadata, load, error,abort) {
                let formdata = new FormData();
                formdata.append('image',file);
                abort();
                
                Images().post(`/main/conceptos/${this.$parent.bandera.id}`,formdata).then((response) => {
                    this.$parent.bandera.imagen = response.data.filename;
                    this.respuesta("Imagen añadida.","success");
                    load("Imagen añadida");
                }).catch(e =>  {
                    console.log(e);
                    this.respuesta("Error al subir la imagen.","error");
                    error("Erro al subir la imagen");
                }); 
            },
        }
    }
</script>

<style lang="scss" scoped>
    .fondo{
        background: #1f3b63;
    }
</style>
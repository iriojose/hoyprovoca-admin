<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Crear Empresa
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

                <!-- formulario parte 1 -->
                <v-scroll-x-transition>
                    <v-form v-model="valid" @submit.prevent="" class="my-5" v-show="!showMessage && view == 1">
                        <v-text-field
                            filled single-line
                            label="Rif" dense
                            rounded hint="format: J-00000000-0"
                            @input="changeRif()"
                            :rules="[required('Rif'),minLength('Rif',12),maxLength('Rif',12)]"
                            v-model="data.rif" persistent-hint
                            color="#2950c3" :disabled="loading || showMessage ? true:false"
                        ></v-text-field>

                        <v-text-field
                            filled single-line
                            label="Nombre" dense
                            rounded hint="Nombre comercial"
                            :rules="[required('Nombre')]"
                            v-model="data.nombre_comercial" persistent-hint
                            color="#2950c3" :disabled="loading || showMessage ? true:false"
                        ></v-text-field>

                        <v-text-field
                            filled single-line
                            label="Correo electrónico" dense
                            rounded hint="Correo electrónico"
                            :rules="[required('Correo electrónico'),emailFormat()]"
                            v-model="data.correo_electronico" persistent-hint
                            color="#2950c3" :disabled="loading || showMessage ? true:false"
                        ></v-text-field>

                        <v-text-field
                            filled single-line
                            label="Telefono" dense
                            rounded hint="format: 0000-000-0000"
                            @input="changeNumber()"
                            :rules="[required('Telefono'),minLength('Rif',13),maxLength('Rif',13)]"
                            v-model="data.telefono1" persistent-hint
                            color="#2950c3" :disabled="loading || showMessage ? true:false"
                        ></v-text-field>

                        <v-select
                            dense filled single-line
                            rounded label="Ubicacion"
                            hint="Ubicacion" persistent-hint
                            color="#2950c3" :disabled="loading"
                            :rules="[requiredObject('Direccion')]" return-object
                            @change="changeUbicacion($event)" :items="municipios"
                            item-text="municipio"
                        ></v-select>
                    </v-form>
                </v-scroll-x-transition>

                <!-- formulario parte 2 -->
                <v-scroll-x-transition>
                    <v-form v-model="valid" @submit.prevent="" class="my-5" v-show="!showMessage && view == 2">
                        <v-text-field
                            filled single-line
                            label="Facebook" dense
                            rounded hint="Url"
                            :rules="[urlFormat()]"
                            v-model="data.facebook" persistent-hint
                            color="#2950c3" :disabled="loading || showMessage ? true:false"
                        ></v-text-field>

                        <v-text-field
                            filled single-line
                            label="Pagina web" dense
                            rounded hint="Url"
                            :rules="[urlFormat()]"
                            v-model="data.pag_web" persistent-hint
                            color="#2950c3" :disabled="loading || showMessage ? true:false"
                        ></v-text-field>

                        <v-text-field
                            filled single-line
                            label="Instagram" dense
                            rounded hint="Url"
                            :rules="[urlFormat()]"
                            v-model="data.instagram" persistent-hint
                            color="#2950c3" :disabled="loading || showMessage ? true:false"
                        ></v-text-field>

                        <v-text-field
                            filled single-line
                            label="Twitter" dense
                            rounded hint="Url"
                            :rules="[urlFormat()]"
                            v-model="data.twitter" persistent-hint
                            color="#2950c3" :disabled="loading || showMessage ? true:false"
                        ></v-text-field>
                    </v-form>
                </v-scroll-x-transition>

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
                        label-idle="Drop image here..."
                        labelFileAdded = "Archivo Añadido"
                        :server="{process}"
                        :onaddfilestart="initProcess"
                    />
                </v-scroll-x-transition>
            </v-card-text>

            <!-- botones de acciones -->
            <v-card-actions v-if="!showMessage">
                <v-scroll-x-transition>
                    <v-btn fab color="#2950c3" small v-show="view == 2" @click="view = 1"> 
                        <v-icon color="#fff">mdi-chevron-left</v-icon>
                    </v-btn>
                </v-scroll-x-transition>

                <v-spacer></v-spacer>
                <slot name="close" v-if="!loading"></slot>
                <v-btn 
                    v-if="view == 1"
                    color="#2950c3" class="text-capitalize white--text" 
                    :loading="loading"
                    @click="view = 2"
                >
                    Siguiente
                </v-btn>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="postEmpresa" :loading="loading"
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
import Empresa from '@/services/Empresa';
import Direcciones from '@/services/Direcciones';
import Images from '@/services/Images';
import vueFilePond from 'vue-filepond';
import Vendedores from '@/services/Vendedores';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
const FilePond = vueFilePond(FilePondPluginImagePreview);

    export default {
        components:{
            FilePond
        },
        props:{
            dialog:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                ...validations,
                type:'error',
                showMessage:false,
                mensaje:'',
                valid:false,
                valid2:false,
                view:1,
                loading:false,
                date:null,
                municipios:[],
                data:{
                    rif:'',
                    nombre_comercial:'',
                    fecha_registro:new Date().toISOString().substr(0, 10),
                    telefono1:'',
                    correo_electronico:'',
                    direccion:"",
                    pag_web:"",
                    facebook:"",
                    instagram:"",
                    twitter: "",
                    estado_id:"16",
                    municipio_id:null,
                    imagen:'default.png'
                },
            }
        },
        mounted(){
            this.getMunicipios();
            this.getVendedores();
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
            }
        },
        methods:{
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
                //setTimeout(() => {this.showMessage = false}, 2000);
            },
            reset(){
                this.showMessage = false;
                this.view = 1;
                this.data.nombre_comercial = '';
                this.data.rif = "";
                this.data.telefono1 = '';
                this.data.correo_electronico = '';
                this.data.pag_web = '';
                this.data.facebook = '';
                this.data.instagram = '';
                this.data.municipios_id = null
            },
            changeRif(){
                if(this.data.rif.length == 1){
                    this.data.rif+='-';
                }else if(this.data.rif.length == 10){
                    this.data.rif+='-';
                }
            },
            changeNumber(){
                if(this.data.telefono1.length == 4){
                    this.data.telefono1+='-';
                }else if(this.data.telefono1.length == 8){
                    this.data.telefono1+='-';
                }
            },
            getMunicipios(){
                Direcciones().get("/16").then((response) => {
                    this.municipios = response.data.data.detalles;
                }).catch(e => {
                    console.log(e);
                });
            },
            getVendedores(){
                Vendedores().get("/").then((response) =>{
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                })
            },
            postEmpresa(){
                this.loading = true;
                Empresa().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.$parent.creado = true;
                    this.$parent.bandera = response.data.data;
                    this.respuesta("Empresa creada exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al crear la empresa.","error");
                });
            },
            changeUbicacion(evt){
                this.data.municipio_id = evt.id;
            },
            initProcess(){
                this.loading = true;
            },
            //metadata, load, error, progress,fieldName, 
            process(fieldName, file, metadata, load, error,abort) {
                let formdata = new FormData();
                formdata.append('image',file);
                abort();
                
                Images().post(`/main/empresa/${this.$parent.bandera.id}`,formdata).then((response) => {
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
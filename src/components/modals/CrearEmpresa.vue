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

                <!--formulario parte 1-->
                <v-stepper v-model="e1" class="elevation-0" non-linear v-if="!showMessage">
                    <v-stepper-header class="elevation-0">
                        <v-stepper-step color="#2950c3" step="1" editable></v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step color="#2950c3" step="2" editable></v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step color="#2950c3" step="3" editable></v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-form v-model="valid" @submit.prevent="">
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
                            </v-form>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <v-form v-model="valid2" @submit.prevent="">
                                <v-select
                                    dense filled single-line
                                    rounded label="Ubicacion Estado"
                                    hint="Estado" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    :rules="[requiredObject('Estado')]" return-object
                                    @change="changeEstados($event)" :items="estados"
                                    item-text="nombre"
                                ></v-select>

                                <v-select
                                    dense filled single-line
                                    rounded label="Municipio"
                                    hint="Municipio" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    :rules="[requiredObject('Municipio')]" return-object
                                    @change="changeMunicipios($event)" :items="municipios"
                                    item-text="municipio"
                                ></v-select>
                            </v-form>
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <v-form v-model="valid3" @submit.prevent="">
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
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>

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
                <v-spacer></v-spacer>
                <slot name="close" v-if="!loading"></slot>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="postEmpresa" :loading="loading"
                    :disabled="valid && valid2 ? false:true"
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
                e1:1,
                ...validations,
                type:'error',
                showMessage:false,
                mensaje:'',
                valid:false,
                valid2:false,
                valid3:false,
                loading:false,
                date:null,
                estados:[],
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
                data2:{
                    nombre:"",
                    adm_empresa_id:null
                }
            }
        },
        mounted(){
            this.getDirecciones();
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
                this.e1 = 1;
                this.showMessage = false;
                this.data.nombre_comercial = '';
                this.data.rif = "";
                this.data.telefono1 = '';
                this.data.correo_electronico = '';
                this.data.pag_web = '';
                this.data.facebook = '';
                this.data.instagram = '';
                this.data.municipio_id = null,
                this.data.estado_id = null;
                this.data2.nombre = null;
                this.data2.adm_empresa_id = null;
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
            changeEstados(evt){
                this.data.estado_id = evt.id;
                this.municipios = evt.detalles;
            },
            changeMunicipios(evt){
                this.data.municipio_id = evt.id;
            },
            getDirecciones(){
                Direcciones().get("/").then((response) => {
                    this.estados = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            postEmpresa(){
                this.loading = true;
                Empresa().post("/",{data:this.data}).then((response) => {
                    this.data2.nombre = this.data.nombre_comercial;
                    this.data2.adm_empresa_id = response.data.data.id;
                    this.postVendedor(response.data.data);
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al crear la empresa.","error");
                });
            },
            postVendedor(empresa){
                Vendedores().post("/",{data:this.data2}).then(() => {
                    this.$parent.creado = true;
                    this.$parent.bandera = empresa;
                    this.respuesta("Empresa creada exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al crear la empresa.","error");
                })
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
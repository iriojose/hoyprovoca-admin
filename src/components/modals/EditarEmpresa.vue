<template>
    <v-dialog v-model="dialog" width="800" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Editar Empresa
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
                <v-form v-model="valid" @submit.prevent="" class="my-5">
                    <v-stepper v-model="e1" class="elevation-0" non-linear>
                        <v-stepper-header class="elevation-0">
                            <v-stepper-step color="#2950c3" step="1" editable></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step color="#2950c3" step="2" editable></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step color="#2950c3" step="3" editable></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step color="#2950c3" step="4" editable></v-stepper-step>
                        </v-stepper-header>

                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <!--imagen-->
                                <v-row justify="center">
                                    <v-avatar tile size="200" v-if="!cambiarImagen">
                                        <v-img :src="image+$parent.bandera.imagen"></v-img>
                                    </v-avatar>
                                </v-row>
                                <!-- boton -->
                                <v-row justify="center" class="mt-2">
                                    <v-btn class="my-2" fab color="#1f3b63" small @click="cambiarImagen = !cambiarImagen" :disabled="loading">
                                        <v-icon v-if="!cambiarImagen" color="#fff">mdi-border-color</v-icon>
                                        <v-icon v-else color="#fff">mdi-chevron-left</v-icon>
                                    </v-btn>
                                </v-row>

                                <!-- Agregar imagen -->
                                <v-scroll-x-transition>
                                    <div v-show="cambiarImagen" class="text-center font-weight-black my-4">
                                        Actualizar imagen
                                    </div>
                                </v-scroll-x-transition>

                                <v-scroll-x-transition>
                                    <FilePond  
                                        v-show="cambiarImagen"
                                        ref="pond"
                                        label-idle="Arrastrar imagen aquí..."
                                        labelFileAdded = "Archivo Añadido"
                                        :server="{process}"
                                        :onaddfilestart="initProcess"
                                    />
                                </v-scroll-x-transition>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                                <v-text-field
                                    filled single-line
                                    label="Rif" dense @input="validEdit();"
                                    rounded hint="Rif de la empresa"
                                    :rules="[required('Rif')]"
                                    v-model="$parent.bandera.rif" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line @input="validEdit();"
                                    label="Nombre" dense
                                    rounded hint="Nombre comercial"
                                    :rules="[required('Nombre')]"
                                    v-model="$parent.bandera.nombre_comercial" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line @input="validEdit();"
                                    label="Correo electrónico" dense
                                    rounded hint="Correo electrónico"
                                    :rules="[required('Correo electrónico'),emailFormat()]"
                                    v-model="$parent.bandera.correo_electronico" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>
                            </v-stepper-content>
                            <v-stepper-content step="3">
                                <v-text-field
                                    filled single-line
                                    label="Telefono" dense
                                    rounded hint="format: 0000-000-0000"
                                    @input="changeNumber()" 
                                    :rules="[required('Telefono'),minLength('Rif',13),maxLength('Rif',13)]"
                                    v-model="$parent.bandera.telefono1" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-select
                                    dense filled single-line
                                    rounded label="Estado" 
                                    hint="Ubicacion Estado" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    :rules="[requiredObject('Estado')]" return-object
                                    @change="changeEstado($event)" :items="estados"
                                    item-text="nombre" v-model="estado"
                                ></v-select>

                                <v-select
                                    dense filled single-line
                                    rounded label="Municipio"
                                    hint="Municipio" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    :rules="[requiredObject('Municipio')]" return-object
                                    @change="changeMunicipio($event)" :items="municipios"
                                    item-text="municipio" v-model="municipio"
                                ></v-select>
                            </v-stepper-content>

                            <v-stepper-content step="4">
                                <v-text-field
                                    filled single-line
                                    label="Facebook" dense
                                    rounded hint="Url" @input="validEdit();"
                                    v-model="$parent.bandera.facebook" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Pagina web" dense
                                    rounded hint="Url" @input="validEdit();"
                                    v-model="$parent.bandera.pag_web" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Instagram" dense
                                    rounded hint="Url" @input="validEdit();"
                                    v-model="$parent.bandera.instagram" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Twitter" dense
                                    rounded hint="Url" @input="validEdit();"
                                    v-model="$parent.bandera.twitter" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-form>
            </v-card-text>

            <!-- botones de acciones -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="close" v-if="!loading"></slot>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="editEmpresa()" :loading="loading"
                    :disabled="!valid && editable"
                >
                    Editar
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
import variables from '@/services/variables_globales';

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
                ...variables,
                ...validations,
                type:'error',
                showMessage:false,
                cambiarImagen:false,
                mensaje:'',
                valid:false,
                valid1:false,
                loading:false,
                estados:[],
                estado:null,
                municipios:[],
                municipio:null,
                editable:false,
            }
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
                else {
                    this.estados.filter(a => this.$parent.bandera.estado_id == a.id ? this.estado=a:null);
                    this.municipios = this.estado.detalles;
                    this.municipios.filter(a => this.$parent.bandera.municipio_id == a.id ? this.municipio = a:null);
                }
            }
        },
        mounted() {
            this.getDirecciones();
        },
        methods:{
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
                //setTimeout(() => {this.showMessage = false}, 2000);
            },
            validEdit(){
                this.editable = true;
            },
            changeNumber(){
                this.validEdit();
                if(this.$parent.bandera.telefono1.length == 4){
                    this.$parent.bandera.telefono1+='-';
                }else if(this.$parent.bandera.telefono1.length == 8){
                    this.$parent.bandera.telefono1+='-';
                }
            },
            changeMunicipio(evt){
                this.validEdit();
                this.$parent.bandera.municipio_id = evt.id;
            },
            changeEstado(evt){
                this.validEdit();
                this.$parent.bandera.estado_id = evt.id;
                this.municipios = evt.detalles;
            },
            reset(){
                this.showMessage = false;
                this.cambiarImagen = false;
                this.e1 = 1;
            },
            editEmpresa(){
                let aux = this.$parent.bandera.grupo;
                delete this.$parent.bandera.grupo;
                this.loading = true;
                Empresa().post(`/${this.$parent.bandera.id}`,{data:this.$parent.bandera}).then(() => {
                    this.$parent.editado = true;
                    this.$parent.bandera.grupo = aux;
                    this.respuesta("Empresa actualizada exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al actualizar la empresa.","error");
                });
            },
            getDirecciones(){
                Direcciones().get("/").then((response) => {
                    this.estados = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
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
                    this.$parent.editado = true;
                    this.respuesta("Imagen actualizada.","success");
                    setTimeout(() => {this.cambiarImagen = false},500);
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
<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Crear Usuario
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
                    <v-text-field
                        filled single-line
                        label="Nombre" dense
                        rounded hint="Nombre"
                        :rules="[required('Nombre')]"
                        v-model="data.nombre" persistent-hint
                        color="#2950c3" :disabled="loading || showMessage ? true:false"
                    ></v-text-field>
                    <v-text-field
                        filled single-line
                        label="Apellido" dense
                        rounded hint="Apellido"
                        :rules="[required('Apellido')]"
                        v-model="data.nombre" persistent-hint
                        color="#2950c3" :disabled="loading || showMessage ? true:false"
                    ></v-text-field>
                    <v-text-field
                        filled single-line
                        label="Correo electrónico" dense
                        rounded hint="Correo electrónico"
                        :rules="[required('correo Electronico'),emailFormat()]"
                        v-model="data.email" persistent-hint
                        color="#2950c3" :disabled="loading || showMessage ? true:false"
                    ></v-text-field>
                    <v-text-field
                        filled single-line
                        label="Telefono" dense
                        rounded hint="format: 0000-000-0000"
                        @input="changeNumber()"
                        :rules="[required('Telefono'),minLength('Telefono',13),maxLength('Telefono',13)]"
                        v-model="data.telefono" persistent-hint
                        color="#2950c3" :disabled="loading || showMessage ? true:false"
                    ></v-text-field>
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
                    @click="postUsuario" :loading="loading"
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
import Usuario from '@/services/Usuario';
import Images from '@/services/Images';
import vueFilePond from 'vue-filepond';

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
                loading:false,
                data:{
                    nombre:'',
                    apellido:'',
                    login:'',
                    password:'',
                    email:'',
                    fecha_nac:new Date().toISOString().substr(0, 10),
                    telefono:'',
                    imagen:'',
                    perfil_id:null,
                    adm_empresa_id:null
                },
            }
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
                this.data.nombre = '';
            },
            changeNumber(){
                if(this.data.telefono.length == 4){
                    this.data.telefono+='-';
                }else if(this.data.telefono.length == 8){
                    this.data.telefono+='-';
                }
            },
            postUsuario(){
                this.loading = true;
                Usuario().post("/",{data:this.data}).then((response) => {
                    this.$parent.creado = true;
                    this.$parent.bandera = response.data.data;
                    this.respuesta("Usuario creado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al crear el usuario.","error");
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
                
                Images().post(`/main/grupos/${this.$parent.bandera.id}`,formdata).then((response) => {
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
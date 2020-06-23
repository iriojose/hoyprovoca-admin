<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Editar Usuario
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
                                    <v-btn fab color="#1f3b63" small @click="cambiarImagen = !cambiarImagen" :disabled="loading">
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
                                        label-idle="Drop image here..."
                                        labelFileAdded = "Archivo Añadido"
                                        :server="{process}"
                                        :onaddfilestart="initProcess"
                                    />
                                </v-scroll-x-transition>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                                <v-text-field
                                    filled single-line
                                    label="Nombre" dense
                                    rounded hint="Nombre"
                                    :rules="[required('Nombre')]"
                                    v-model="$parent.bandera.nombre" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Apellido" dense
                                    rounded hint="Apellido"
                                    :rules="[required('Apellido')]"
                                    v-model="$parent.bandera.apellido" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Telefono" dense
                                    rounded hint="format: 0000-000-0000"
                                    @input="changeNumber()"
                                    :rules="[required('Telefono'),minLength('Telefono',13),maxLength('Telefono',13)]"
                                    v-model="$parent.bandera.telefono" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            dense v-model="$parent.bandera.fecha_nac"
                                            label="Cumpleaños" color="#2950c3" append-icon="event" 
                                            filled v-on="on" rounded hint="Formato YYYY/MM/DD" 
                                            persistent-hint single-line
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="$parent.bandera.fecha_nac" landscape show-current  header-color="#2950c3" color="#2950c3"  locale="es"/>
                                </v-menu>

                            </v-stepper-content>
                            <v-stepper-content step="3">

                                <v-text-field
                                    filled rounded persistent-hint
                                    dense :disabled="loading"
                                    v-model="$parent.bandera.login" single-line
                                    type="text" color="#0f2441"
                                    :rules="[required('Nombre de usuario'),minLength('Nombre de usuario',4)]"
                                    label="Nombre de usuario" hint="Ej: prueba2121" 
                                ></v-text-field>

                                <v-text-field
                                    filled rounded disabled
                                    v-model="$parent.bandera.email" single-line
                                    dense color="#2950c3" 
                                    label="Ingrese correo electrónico"
                                    hint="Ej: ejemplo@gmail.com" persistent-hint
                                ></v-text-field>

                                <v-text-field
                                    filled rounded hint="Contraseña" persistent-hint
                                    dense disabled v-model="$parent.bandera.password" 
                                    single-line type="password" color="#0f2441"
                                    :rules="[required('Contraseña'),minLength('Contraseña',6)]"
                                    label="Nueva contraseña"
                                ></v-text-field>

                            </v-stepper-content>
                            <v-stepper-content step="4">
                                <v-select
                                    dense filled single-line
                                    rounded label="Nivel de usuario"
                                    hint="Niveles de usuario" persistent-hint
                                    color="#2950c3" disabled return-object :items="items"
                                    item-text="nombre" v-model="nivel"
                                ></v-select>
                                
                                <!--Select para grupo -->
                                <v-select
                                    v-if="ver" dense filled single-line
                                    rounded label="Empresa" hint="Seleccion de empresa" 
                                    persistent-hint color="#2950c3" disabled
                                    item-text="nombre_comercial" v-model="empresa"
                                >
                                    <template slot="item" slot-scope="{ item }">
                                        <v-avatar size="40" class="mr-5">
                                            <v-img :src="image+item.imagen"></v-img>
                                        </v-avatar>  
                                        {{ item.nombre_comercial }} 
                                    </template>
                                    <template v-slot:selection="{item}">
                                        <v-avatar size="30" class="mr-5">
                                            <v-img :src="image+item.imagen"></v-img>
                                        </v-avatar>  
                                        <span>{{ item.nombre_comercial }}</span>
                                    </template>
                                </v-select>
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
                    @click="BloquearUsuario" :loading="loading"
                    v-if="$parent.bandera.bloqueado == 0"
                >
                    Bloquear
                </v-btn>   
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="DesbloquearUsuario" :loading="loading"
                    v-else
                >
                    Desbloquear
                </v-btn>  
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="editUsuario" :loading="loading"
                    :disabled="!valid"
                >
                    Editar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Images from '@/services/Images';
import Usuario from '@/services/Usuario';
import validations from '@/validations/validations';
import vueFilePond from 'vue-filepond';
import variables from '@/services/variables_globales';
import Empresa from '@/services/Empresa';

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
                loading:false,
                //variables del componente
                nivel:null,
                empresa:null,
                ver:false,
                items:[
                    {id:1,nombre:"Administrador"},
                    {id:2,nombre:"Super Usuario"},
                    {id:3,nombre:"Cliente"}
                ],
            }
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
                else this.init();
            }
        },
        methods:{
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
            },
            init(){
                this.$parent.bandera.fecha_nac.substr(0, 10); 
                this.items.filter(a => a.id == this.$parent.bandera.perfil_id ? this.nivel=a:null);
                if(this.$parent.bandera.perfil_id == 2){
                    this.ver = true;
                    let data = JSON.parse(window.localStorage.getItem('empresas'));
                    if(data) {
                        data.empresas.filter(a => a.id == this.$parent.bandera.adm_empresa_id ? this.empresa=a:null);
                    }else this.getEmpresas();
                }
            },
            reset(){
                this.showMessage = false;
                this.cambiarImagen = false;
                this.e1 = 1;
            },
            changeNumber(){
                if(this.$parent.bandera.telefono.length == 4){
                    this.$parent.bandera.telefono+='-';
                }else if(this.$parent.bandera.telefono.length == 8){
                    this.$parent.bandera.telefono+='-';
                }
            },
            editUsuario(){
                let auxPerfil = this.$parent.bandera.perfil;
                let auxEstado = this.$parent.bandera.estado;
                delete this.$parent.bandera.estado;
                delete this.$parent.bandera.perfil;
                this.loading = true;
                Usuario().post(`/${this.$parent.bandera.id}`,{data:this.$parent.bandera}).then(() => {
                    this.$parent.editado = true;
                    this.$parent.bandera.estado = auxEstado;
                    this.$parent.bandera.perfil = auxPerfil;
                    this.respuesta("Usuario actualizado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al actualizar el usuario.","error");
                });
            },
            BloquearUsuario(){
                this.loading = true;
                Usuario().post(`/${this.$parent.bandera.id}`,{data:{bloqueado:1}}).then(() => {
                    this.$parent.editado = true;
                    this.$parent.bandera.bloqueado = 1;
                    this.$parent.bandera.estado = "Bloqueado";
                    this.respuesta("Usuario Bloqueado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al bloquear el usuario.","error");
                })
            },
            DesbloquearUsuario(){
                this.loading = true;
                Usuario().post(`/${this.$parent.bandera.id}`,{data:{bloqueado:0}}).then(() => {
                    this.$parent.editado = true;
                    this.$parent.bandera.bloqueado = 0;
                    this.$parent.bandera.estado = "Activo";
                    this.respuesta("Usuario Desbloqueado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al Desbloquear el usuario.","error");
                })
            },
            getEmpresa(){
                Empresa().get("/").then((response) => {
                    response.data.data.filter(a => a.id == this.$parent.bandera.adm_empresa_id ? this.empresa=a:null);
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
                
                Images().post(`/main/usuario/${this.$parent.bandera.id}`,formdata).then((response) => {
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
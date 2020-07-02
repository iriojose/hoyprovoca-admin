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
                                    label="Apellido" dense
                                    rounded hint="Apellido"
                                    :rules="[required('Apellido')]"
                                    v-model="data.apellido" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Telefono" dense
                                    rounded hint="format: 0000-000-0000"
                                    @input="changeNumber()"
                                    :rules="[required('Telefono'),minLength('Telefono',13),maxLength('Telefono',13)]"
                                    v-model="data.telefono" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            dense v-model="data.fecha_nac"
                                            label="Cumpleaños" color="#2950c3" append-icon="event" 
                                            filled v-on="on" rounded hint="Formato YYYY/MM/DD" 
                                            persistent-hint single-line
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="data.fecha_nac" landscape show-current  header-color="#2950c3" color="#2950c3"  locale="es"/>
                                </v-menu>

                            </v-stepper-content>
                            <v-stepper-content step="2">

                                <v-text-field
                                    filled rounded persistent-hint
                                    dense :disabled="loading"
                                    v-model="data.login" single-line
                                    type="text" color="#0f2441"
                                    :rules="[required('Nombre de usuario'),minLength('Nombre de usuario',6)]"
                                    label="Nombre de usuario" hint="Ej: prueba2121" 
                                ></v-text-field>

                                <v-text-field
                                    filled rounded :disabled="loading"
                                    v-model="data.email" single-line
                                    dense color="#2950c3" :success-messages="success"
                                    :error-messages="errors" @input="getUser(data.email)"
                                    label="Ingrese correo electrónico"
                                    hint="Ej: ejemplo@gmail.com" persistent-hint
                                >
                                    <template v-slot:append>
                                        <v-fade-transition leave-absolute>
                                            <v-progress-circular
                                                v-if="loading2" size="24"
                                                color="#0f2441" indeterminate
                                            ></v-progress-circular>
                                            <img v-else width="24" height="24" :src="require('@/assets/logo 3.png')">
                                        </v-fade-transition>
                                    </template>
                                </v-text-field>

                                <v-text-field
                                    filled rounded hint="Contraseña" persistent-hint
                                    dense :disabled="loading"
                                    v-model="data.password" single-line
                                    type="password" color="#0f2441"
                                    :rules="[required('Contraseña'),minLength('Contraseña',6)]"
                                    label="Nueva contraseña"
                                ></v-text-field>

                                <v-text-field
                                    filled rounded dense hint="Confirmar contraseña" persistent-hint
                                    :disabled="loading" v-model="password2"
                                    single-line type="password" color="#0f2441"
                                    :rules="[required('Confirmar contraseña'),passwordConfirmationRule()]"
                                    label="Confirmar contraseña"
                                ></v-text-field>

                            </v-stepper-content>
                            <v-stepper-content step="3">
                                <v-select
                                    dense filled single-line
                                    rounded label="Nivel de usuario"
                                    hint="Niveles de usuario" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    :rules="[requiredObject('Nivel de usuario')]" return-object
                                    @change="changeNivel($event)" :items="items"
                                    item-text="nombre" v-model="nivel"
                                ></v-select>
                                
                                <!--Select para grupo -->
                                <v-select
                                    v-if="ver" dense filled single-line
                                    rounded label="Empresa" hint="Seleccion de empresa" persistent-hint
                                    color="#2950c3" :disabled="loading || showMessage ? true:false"
                                    :rules="[requiredObject('Empresa')]" return-object
                                    @change="changeEmpresa($event)" :items="empresas"
                                    item-text="nombre_comercial" v-model="empresa"
                                >
                                    <template v-slot:append-item>
                                        <v-row justify="center">
                                            <v-btn 
                                                @click="getEmpresas()" tile 
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
                    @click="postUsuario" :loading="loading"
                    :disabled="valid && success !== '' ? false:true"
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
import Auth from '@/services/Auth';
import Empresa from '@/services/Empresa';
import variables from '@/services/variables_globales';
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
                    apellido:'',
                    login:'',
                    password:'',
                    email:'',
                    fecha_nac:new Date().toISOString().substr(0, 10),
                    telefono:'',
                    usuario_in:new Date().toISOString().substr(0, 10),
                    imagen:'default.png',
                    perfil_id:null,
                    adm_empresa_id:null,
                    bloqueado:0,
                },
                //variables para el select de empresa
                empresa:null,
                empresas:[],
                total:0,
                offset:0,
                ver:false,
                loading2:false,
                //validacion del email y confirmar contraseña
                success:'',
                errors:[],
                password2:'',
                //niveles de usuario
                items:[
                    {id:1,nombre:"Administrador"},
                    {id:2,nombre:"Super Usuario"},
                ],
                nivel:null
            }
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
            }
        },
        computed:{
            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.empresas.length >= this.total) return true;
                else return false;
            },
            passwordConfirmationRule() {
                return () => (this.data.password === this.password2) || 'Las contraseñas no coinciden.';
            },
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('empresas'));

            if(data) {
                this.empresas = data.empresas;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getEmpresas();
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
                this.data.nombre = '';
                this.data.apellido = "";
                this.data.login = "",
                this.data.password = '';
                this.data.email = '';
                this.data.fecha_nac = new Date().toISOString().substr(0, 10);
                this.data.telefono = '';
                this.data.perfil_id = null;
                this.data.adm_empresa_id = null;
                this.nivel = null;
                this.ver = false;
                this.empresa = null;
                this.e1 = 1;
                this.errors = [];
                this.success = "";
            },
            changeNumber(){
                if(this.data.telefono.length == 4){
                    this.data.telefono+='-';
                }else if(this.data.telefono.length == 8){
                    this.data.telefono+='-';
                }
            },
            changeNivel(evt){
                this.data.perfil_id = evt.id;
                if(evt.id == 2) this.ver = true;
                else{
                    this.ver = false;
                    this.empresa = null;
                    this.data.adm_empresa_id = null;
                }
            },
            changeEmpresa(evt){
                this.data.adm_empresa_id = evt.id;
            },
            postUsuario(){
                this.loading = true;
                Auth().post("/signup",{data:this.data}).then((response) => {
                    this.$parent.creado = true;
                    this.$parent.bandera = response.data.response.data;
                    this.$parent.bandera.estado = "Activo";
                    this.items.filter(a => a.id == this.$parent.bandera.perfil_id ? this.$parent.bandera.perfil = a.nombre:null);
                    this.respuesta("Usuario creado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al crear el usuario.","error");
                });
            },
            getEmpresas(){
                Empresa().get("/").then((response) => {
                    this.empresas = response.data.data;
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
                
                Images().post(`/main/usuario/${this.$parent.bandera.id}`,formdata).then((response) => {
                    this.$parent.bandera.imagen = response.data.filename;
                    this.respuesta("Imagen añadida.","success");
                    load("Imagen añadida");
                }).catch(e =>  {
                    console.log(e);
                    this.respuesta("Error al subir la imagen.","error");
                    error("Erro al subir la imagen");
                }); 
            },
            getUser(email){
                this.errors = [];
                this.success = '';
                if(email.length <= 0) return this.errors.push('Debe ingresar un email');
                // eslint-disable-next-line
                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/ 
                if (!regex.test(email)) return this.errors.push(`Debe ingresar un email válido`);
                this.loading2 = true;
                Usuario().get(`/?email=${email}`).then((response) => {
                    this.loading2 = false;
                    if(response.data.data) {
                        return this.errors.push('Este email ya fue registrado');
                    }else{
                        this.success='Email verificado';
                    }
                }).catch(e => {
                    console.log(e);
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
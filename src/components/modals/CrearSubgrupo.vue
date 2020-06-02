<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Crear Grupo
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
                        rounded hint="Subcategorías de Productos"
                        :rules="[required('Nombre')]"
                        v-model="data.nombre" persistent-hint
                        color="#2950c3" :disabled="loading || showMessage ? true:false"
                    ></v-text-field>

                    <!--Select para grupo -->
                    <v-select
                        dense filled single-line
                        rounded label="Grupo"
                        hint="Categorías de productos" persistent-hint
                        color="#2950c3" :disabled="loading || showMessage ? true:false"
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
                    @click="postSubgrupo" :loading="loading"
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
import SubGrupos from '@/services/SubGrupos';
import Grupos from '@/services/Grupos';
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
                ...variables,
                ...validations,
                type:'error',
                showMessage:false,
                mensaje:'',
                valid:false,
                loading:false,
                data:{
                    nombre:'',
                    imagen:'default.png',
                    adm_grupos_id:null,
                    visualizar:0,
                    posicion:1
                },
                //variables del modal de grupos
                grupo:null,
                grupos:[],
                total:0,
                offset:0,
                loading2:false
            }
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
            }
        },
        computed:{
            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.grupos.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('grupos'));

            if(data) {
                this.grupos = data.grupos;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getGrupos();
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
                this.data.adm_grupos_id = null;
                this.grupo = null;
            },
            postSubgrupo(){
                this.loading = true;
                SubGrupos().post("/",{data:this.data}).then((response) => {
                    this.$parent.creado = true;
                    this.$parent.bandera = response.data.data;
                    this.$parent.bandera.grupo = this.grupo;
                    this.respuesta("SubGrupo creado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al crear el subgrupo.","error");
                });
            },
            changeGrupo(evt){
                this.data.adm_grupos_id = evt.id;
            },
            getGrupos(){
                this.loading2=true;
                Grupos().get(`/?offset=${this.offset}&order=desc`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.loading2=false;
                    this.offset+=50;
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

                Images().post(`/main/subgrupos/${this.$parent.bandera.id}`,formdata).then((response) => {
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
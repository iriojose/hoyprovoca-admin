<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Editar Subgrupo
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
                        label-idle="Arrastrar imagen aquí..."
                        labelFileAdded = "Archivo Añadido"
                        :server="{process}"
                        :onaddfilestart="initProcess"
                    />
                </v-scroll-x-transition>

                <!-- formulario-->
                <v-form v-model="valid" @submit.prevent="" class="my-5">
                    <v-text-field
                        filled single-line
                        label="Nombre" dense
                        rounded hint="Sub Categorías de Productos"
                        :rules="[required('Nombre')]"
                        v-model="$parent.bandera.nombre" persistent-hint
                        color="#2950c3" :disabled="loading"
                    ></v-text-field>

                    <!--Select para grupo -->
                    <v-select
                        dense filled single-line
                        rounded label="Grupo"
                        hint="Categorías de productos" persistent-hint
                        color="#2950c3" :disabled="loading"
                        :rules="[requiredObject('Grupo')]" return-object
                        @change="changeGrupo($event)" :items="grupos"
                        item-text="nombre" v-model="$parent.bandera.grupo"
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
            </v-card-text>

            <!-- botones de acciones -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="close" v-if="!loading"></slot>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="editSubgrupo" :loading="loading"
                    :disabled="!valid"
                >
                    Editar
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
                cambiarImagen:false,
                mensaje:'',
                valid:false,
                loading:false,
                //variables del select de grupo
                grupos:[],
                total:0,
                offset:0,
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
                this.cambiarImagen = false;
            },
            editSubgrupo(){
                let aux = this.$parent.bandera.grupo;
                delete this.$parent.bandera.grupo;
                this.loading = true;
                SubGrupos().post(`/${this.$parent.bandera.id}`,{data:this.$parent.bandera}).then(() => {
                    this.$parent.editado = true;
                    this.$parent.bandera.grupo = aux;
                    this.respuesta("SubGrupo actualizado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al actualizar el subgrupo.","error");
                });
            },
            changeGrupo(evt){
                this.grupo = evt;
                this.$parent.bandera.adm_grupos_id = evt.id;
            },
            getGrupos(){
                Grupos().get(`/?offset=${this.offset}&order=desc`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
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
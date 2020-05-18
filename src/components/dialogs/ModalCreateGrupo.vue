<template>
    <v-dialog v-model="dialog" width="500" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title>
                Nuevo Grupo
                <v-spacer></v-spacer>
                <slot name="close" v-if="!loading || !loadingImagen"></slot>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form v-model="valid" class="pt-8" v-if="!loading && !showMessage">
                    <v-row justify="center">
                        <v-text-field
                            solo
                            color="#232323"
                            hint="Categorías de productos"
                            persistent-hint
                            :rules="[required('Nombre')]"
                            v-model="data.nombre"
                            label="Nombre"
                            dense
                        ></v-text-field>

                        <v-btn 
                            elevation="3" class="mt-5 text-capitalize white--text" 
                            block @click="postGrupo" color="#232323" :disabled="!valid"
                        >
                            Guardar
                        </v-btn>
                    </v-row>
                </v-form>
                <v-row justify="center">

                <LoaderRect v-if="loading" class="py-12" />
                </v-row>
            </v-card-text>

            <v-card-text v-if="showMessage">
                <div class="py-5 text-center title font-weight-bold">
                    <div class="mb-3"><v-icon size="50" :color="color">{{icon}}</v-icon></div>
                    {{mensaje}}
                </div>

                <div v-if="created" class="text-center font-weight-black mb-4">
                    ¿ Agregar imagen al grupo creado ?
                </div>
                <FilePond  
                    v-if="created"
                    ref="pond"
                    label-idle="Drop image here..."
                    labelFileAdded = "Archivo Añadido"
                    :server="{process}"
                />

                <v-row justify="space-around" class="pt-5">
                    <div>
                        <v-btn tile @click="reset" elevation="3" color="#232323" 
                            class="white--text caption text-capitalize mx-2"
                        >
                            ¿ Crear otro grupo ?
                        </v-btn>
                    </div>
                    <div><slot name="close2" v-if="showMessage"></slot></div>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import Grupos from '@/services/Grupos';
import validations from '@/validations/validations';
import LoaderRect from '@/components/loaders/LoaderRect';
import vueFilePond from 'vue-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import Images from '@/services/Images';

const FilePond = vueFilePond( FilePondPluginImagePreview);

    export default {
        components:{
            LoaderRect,
            FilePond
        },
        props:{
            dialog:{
                type:Boolean,
                default:false,
            }
        },
        data(){
            return {
                ...validations,
                valid:false,
                loading:false,
                loadingImagen:false,
                data:{
                    nombre:''
                },
                created:null,
                icon:'',
                color:'',
                mensaje:'',
                showMessage:false,
            }
        },
        watch: {
            dialog(){
                if(!this.dialog){
                   this.reset();
                }
            }
        },
        methods:{
            reset(){
                this.created = null
                this.showMessage = false;
                this.data.nombre = '';
            },
            respuesta(icon,mensaje,color){
                this.icon = icon;
                this.color = color;
                this.mensaje = mensaje;
                this.loading = false;
                this.loadingImagen = false;
                this.showMessage = true;
            },
            postGrupo(){
                this.loading = true;
                Grupos().post("/",{data:this.data}).then((response) => {
                    this.created = response.data.data;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Grupo creado.","#388E3C");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            process(fieldName, file, metadata, load, error, progress) {
                this.loadingImagen = true;
                progress(true, 0, 1);
                let formdata = new FormData();
                formdata.append('image',file);

                Images().post(`/main/grupos/${this.created.id}`,formdata).then(() => {
                    this.created = null;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Imagen añadida.","#388E3C");
                }).catch(e =>  {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                }); 
            },
        }
    }
</script>

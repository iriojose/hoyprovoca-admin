<template>
    <v-dialog v-model="dialog" width="450" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title>
                Editar Subgrupo 
                <v-spacer></v-spacer>
                <v-scroll-x-transition>
                    <div class="mx-2" v-show="showMessage">Salir</div>
                </v-scroll-x-transition>
                <slot name="close" v-if="!loadingImagen"></slot>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form v-model="valid" @submit.prevent="" v-if="!showMessage">
                    <v-row justify="center">
                        <v-avatar class="my-5 text-center" size="200" v-if="!otherImage">
                            <v-img :src="image+$parent.bandera.imagen" />
                        </v-avatar>
                        <v-col cols="12" md="12" sm="12" v-if="otherImage">
                            <FilePond  
                                ref="pond"
                                label-idle="Drop image here..."
                                labelFileAdded = "Archivo Añadido"
                                :server="{process}"
                                :onaddfilestart="initProcess"
                            />
                        </v-col>
                    </v-row>

                    <v-row justify="center" v-if="!otherImage" class="my-3">
                        <v-btn text color="#232323" class="text-capitalize" @click="otherImage = true">
                            Cambiar Imagen
                        </v-btn>
                    </v-row>

                    <v-text-field
                        label="Nombre"
                        solo
                        @input="change"
                        v-model="$parent.bandera.nombre"
                        type="text"
                        :disabled="loading"
                        color="#005598"
                        hint="Nombre"
                        persistent-hint
                        dense
                        counter="20"
                        :rules="[required('Nombre'), maxLength('Nombre',20), minLength('Nombre',2)]"
                    />

                    <v-dialog v-model="dialog1" width="400" transition="dialog-bottom-transition">
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-on="on"
                                label="Grupo"
                                solo
                                v-model="grupo.nombre"
                                :disabled="loading"
                                color="#005598"
                                dense
                                :rules="[required('Grupo')]"
                            />
                        </template>
                        <v-card width="100%" class="pa-2">
                            <v-card-actions>
                                <v-btn 
                                    @click="getGrupos()" 
                                    dark 
                                    class="mb-2 mx-2 text-capitalize caption" 
                                    color="#005598"
                                    :disabled="grupos.length == total || loading2 ? true:false"
                                >
                                    Ver más 
                                    <v-icon dark class="ml-2">mdi-chevron-right-box</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-text-field
                                    v-model="search"
                                    label="Buscar"
                                    single-line
                                    append-icon="mdi-magnify"
                                    type="text"
                                    color="#005598"
                                    hide-details
                                    dense
                                />
                            </v-card-actions>
                            <v-card-text>
                                <v-data-table
                                    :loading="loading2 && '#005598'" 
                                    loading-text="Loading... Please wait" 
                                    :headers="headers" 
                                    :items="grupos"  
                                    :search="search"
                                    @click:row="changeGrupo($event)"
                                >
                                    <template v-slot:item.imagen="{item}">
                                        <v-avatar size="50">
                                            <v-img :src="image+item.imagen"></v-img>
                                        </v-avatar>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-btn 
                        :disabled="mutations && valid ? false:true"
                        :loading="loading"  
                        color="#232323"
                        block
                        @click="editSubgrupos()"
                        class="text-capitalize font-weight-bold white--text"
                    >
                        Guardar
                    </v-btn>
                </v-form>
            </v-card-text>
            <v-scroll-x-transition>
                <v-card-text v-show="showMessage">
                    <Message :icon="icon" :mensaje="mensaje" :color="color" />
                </v-card-text>
            </v-scroll-x-transition>  
        </v-card>
    </v-dialog>
</template>

<script>
import variables from '@/services/variables_globales';
import validations from '@/validations/validations';
import Grupos from '@/services/Grupos';
import SubGrupos from '@/services/SubGrupos';
import Message from '@/components/mensajes/Message';
import vueFilePond from 'vue-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import Images from '@/services/Images';

const FilePond = vueFilePond( FilePondPluginImagePreview);

    export default {
        components:{
            Message,
            FilePond,
        },
        props:{
            dialog:{
                type:Boolean,
                default:false
            },
        },
        data(){
            return {
                ...validations,
                ...variables,
                mutations: false,
                showMessage:false,
                otherImage:false,
                valid:false,
                loading:false,
                loadingImagen:false,
                icon:'',
                color:'',
                mensaje:'',
                grupo:{
                    nombre:''
                },
                total:0,
                offset:0,
                loading2:false,
                dialog1:false,
                search:'',
                grupos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                ],
            }
        },
        watch: {
            dialog(){
                if (!this.dialog) this.reset();
            }
        },
        mounted(){
            this.getGrupos();
        },
        methods:{
            editSubgrupos(){
                this.loading = true;
                SubGrupos().post(`/${this.$parent.bandera.id}`,{data:this.$parent.bandera}).then(() => {
                    this.respuesta("mdi-checkbox-marked-circle-outline","Subgrupo Actualizado.","#388E3C");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            respuesta(icon,mensaje,color){
                this.icon = icon;
                this.color = color;
                this.mensaje = mensaje;
                this.loading = false;
                this.showMessage = true;
            },
            initProcess(){
                this.loadingImagen = true;
            },
            change(){
                this.mutations = true;
            },
            reset(){
                setTimeout(() => {
                    this.mutations = false;
                    this.showMessage = false;
                    this.otherImage = false;
                },500);
            },
            changeGrupo(evt){
                this.$parent.bandera.adm_grupos_id = evt.id;
                this.grupo = evt;
                this.dialog1 = false;
                this.change();
            },
            getGrupos(){
                this.loading2=true;
                Grupos().get(`/?limit=50&offset=${this.offset}&order=desc`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.loading2=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            process(fieldName, file, metadata, load, error, progress) {
                progress(true, 0, 1);
                let formdata = new FormData();
                formdata.append('image',file);

                Images().post(`/main/subgrupos/${this.$parent.bandera.id}`,formdata).then((response) => {
                   this.$parent.bandera.imagen = response.data.filename;
                   this.loadingImagen = false;
                    //this.respuesta("mdi-checkbox-marked-circle-outline","Imagen añadida.","#388E3C");
                }).catch(e =>  {
                    console.log(e);
                    this.loadingImagen=false;
                    //this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                }); 
            },
        }
    }
</script>

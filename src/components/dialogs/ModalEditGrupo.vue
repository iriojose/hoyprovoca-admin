<template>
    <v-dialog v-model="dialog" width="450" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title>
                Editar Grupo 
                <v-spacer></v-spacer>
                <v-scroll-x-transition>
                    <div class="mx-2" v-show="showMessage">Salir</div>
                </v-scroll-x-transition>
                <slot name="close"></slot>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form v-model="valid" @submit.prevent="" v-if="!showMessage">
                    <v-row justify="center">
                        <v-avatar class="my-5 text-center" size="200" v-if="!otherImage">
                            <v-img :src="image+$parent.bandera.imagen" />
                        </v-avatar>
                        <v-col cols="12" md="12" sm="12" v-if="!otherImage">
                            <v-btn text color="#232323" class="text-capitalize" @click="otherImage = true">
                                Cambiar Imagen
                            </v-btn>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" v-if="otherImage">
                            <FilePond  
                                ref="pond"
                                label-idle="Drop image here..."
                                labelFileAdded = "Archivo Añadido"
                                :server="{process}"
                            />
                        </v-col>
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
                    <v-btn 
                        :disabled="mutations && valid ? false:true"
                        :loading="loading"  
                        color="#232323"
                        block
                        @click="editGrupos()"
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
                icon:'',
                color:'',
                mensaje:''
            }
        },
        watch: {
            dialog(){
                if (!this.dialog) this.reset();
            }
        },
        methods:{
            editGrupos(){
                this.loading = true;
                Grupos().post(`/${this.$parent.bandera.id}`,{data:this.$parent.bandera}).then(() => {
                    this.respuesta("mdi-checkbox-marked-circle-outline","Grupo Actualizado.","#388E3C");
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
            change(){
                this.mutations = true;
            },
            reset(){
                this.mutations = false;
                this.showMessage = false;
                this.otherImage = false;
            },
            process(fieldName, file, metadata, load, error, progress) {
                progress(true, 0, 1);
                let formdata = new FormData();
                formdata.append('image',file);

                Images().post(`/main/grupos/${this.$parent.bandera.id}`,formdata).then((response) => {
                   this.$parent.bandera.imagen = response.data.filename;
                    //this.respuesta("mdi-checkbox-marked-circle-outline","Imagen añadida.","#388E3C");
                }).catch(e =>  {
                    console.log(e);
                    //this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                }); 
            },
        }
    }
</script>

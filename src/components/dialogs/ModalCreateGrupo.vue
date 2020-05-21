<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title>
                Nuevo Grupo
                <v-spacer></v-spacer>
                <v-scroll-x-transition>
                    <div class="mx-2" v-show="showMessage || !loadingImagen">Salir</div>
                </v-scroll-x-transition>
                <slot name="close" v-if="!loading && !loadingImagen ? true:false"></slot>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form v-model="valid" class="pt-8" v-if="!loading && !showMessage" @submit.prevent="">
                    <v-row justify="center">
                        <v-text-field
                            outlined
                            filled
                            color="#232323"
                            hint="Categorías de productos"
                            persistent-hint
                            :rules="[required('Nombre')]"
                            v-model="data.nombre"
                            label="Nombre"
                            dense
                        ></v-text-field>

                        <v-btn 
                            class="mt-5 text-capitalize white--text" 
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
            <v-scroll-x-transition>
                <v-card-text v-show="showMessage">
                    <v-scroll-x-transition>
                        <Message v-show="showMessage" :icon="icon" :mensaje="mensaje" :color="color" />
                    </v-scroll-x-transition> 

                    <div v-show="$parent.creado" class="text-center font-weight-black mb-4">
                        ¿ Agregar imagen al Grupo creado ?
                    </div>

                    <FilePond  
                        v-if="$parent.creado"
                        ref="pond"
                        label-idle="Drop image here..."
                        labelFileAdded = "Archivo Añadido"
                        :server="{process}"
                        :onaddfilestart="initProcess"
                    />
                </v-card-text>
            </v-scroll-x-transition> 
        </v-card>
    </v-dialog>
</template>

<script>
import Grupos from '@/services/Grupos';
import Message from '@/components/mensajes/Message';
import Images from '@/services/Images';
import validations from '@/validations/validations';
import LoaderRect from '@/components/loaders/LoaderRect';

    export default {
        components:{
            Message,
            LoaderRect
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
                valid:false,
                loading:false,
                loadingImagen:false,
                icon:'',
                color:'',
                mensaje:'',
                showMessage:false,
                data:{
                    nombre:'',
                    imagen:'default.png',
                    visualizar:0,
                    posicion:1
                },
            }
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
            }
        },
        methods: {
            respuesta(icon,mensaje,color){
                this.icon = icon;
                this.color = color;
                this.mensaje = mensaje;
                this.loading = false;
                this.loadingImagen = false;
                this.showMessage = true;
            },
            reset(){
                this.showMessage = false;
                this.data.nombre = '';
            },
            postGrupo(){
                this.loading = true;
                Grupos().post("/",{data:this.data}).then((response) => {
                    this.$parent.creado = true;
                    this.$parent.bandera = response.data.data;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Grupo creado.","#388E3C");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            initProcess(){
                this.loadingImagen = true;
            },
            process(fieldName, file, metadata, load, error, progress) {
                progress(true, 0, 1);
                let formdata = new FormData();
                formdata.append('image',file);

                Images().post(`/main/grupos/${this.$parent.bandera.id}`,formdata).then((response) => {
                    this.$parent.bandera.imagen = response.data.filename;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Imagen añadida.","#388E3C");
                }).catch(e =>  {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                }); 
            },
        },
    }
</script>

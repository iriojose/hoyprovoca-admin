<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title>
                Nuevo Subgrupo
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
                            hint="Sub Categorías de productos"
                            persistent-hint
                            :rules="[required('Nombre')]"
                            v-model="data.nombre"
                            label="Nombre"
                            dense
                        ></v-text-field>

                        <v-dialog v-model="dialog1" width="400" transition="dialog-bottom-transition">
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-on="on"
                                    label="Grupo"
                                    outlined
                                    filled
                                    v-model="grupo.nombre"
                                    :disabled="loading"
                                    color="#232323"
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
                            class="mt-5 text-capitalize white--text" 
                            block @click="postSubgrupo" color="#232323" :disabled="!valid"
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
                        ¿ Agregar imagen al Subgrupo creado ?
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
import SubGrupos from '@/services/SubGrupos';
import Message from '@/components/mensajes/Message';
import Images from '@/services/Images';
import variables from '@/services/variables_globales';
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
                ...variables,
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
                    adm_grupos_id:0,
                    imagen:'default.png',
                    visualizar:0,
                    posicion:1
                },
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
        mounted() {
            this.getGrupos();
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
                this.grupo = {
                    nombre:''
                };
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
            postSubgrupo(){
                this.loading = true;
                SubGrupos().post("/",{data:this.data}).then((response) => {
                    this.$parent.creado = true;
                    this.$parent.bandera = response.data.data;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Grupo creado.","#388E3C");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            changeGrupo(evt){
                this.data.adm_grupos_id = evt.id;
                this.grupo = evt;
                this.dialog1 = false;
            },
            initProcess(){
                this.loadingImagen = true;
            },
            process(fieldName, file, metadata, load, error, progress) {
                progress(true, 0, 1);
                let formdata = new FormData();
                formdata.append('image',file);

                Images().post(`/main/subgrupos/${this.$parent.bandera.id}`,formdata).then((response) => {
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

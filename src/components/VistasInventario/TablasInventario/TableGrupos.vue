<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="dialog=!dialog">
                Nuevo
                <v-icon dark class="ml-2">add_circle</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Buscar"
                single-line
                append-icon="search"
                type="text"
                color="#005598"
                hide-details
                dense
            />
        </v-toolbar>
        <v-data-table 
            :loading="loading && '#005598'" loading-text="Loading... Please wait" :headers="headers" :items="grupos" class="elevation-0" :search="search"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" width="400" :persistent="loading">
            <v-card width="100%">
                <v-card-title class="color">
                    {{title}}
                    <v-spacer></v-spacer>
                    <v-icon @click="dialog=!dialog" :disabled="loading">cancel</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form v-model="valid" @submit.prevent="" class="px-5">
                        <v-row>
                            <v-col cols="12" md="12" sm="12">
                                <v-card width="100%" height="170" class="pa-2" elevation="0">
                                    <v-img height="150" width="100%" contain :src="showImage" />
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-file-input
                                    :rules="rules"
                                    accept="image/png, image/jpeg"
                                    placeholder="Seleccionar imagen"
                                    prepend-icon="mdi-camera"
                                    label="Imagen Grupo"
                                    dense
                                    :disabled="loading"
                                    @change="procesoImg($event)"
                                    color="#005598"
                                    v-model="imagen"
                                ></v-file-input>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-text-field
                                    label="Nombre"
                                    v-model="editItem.nombre"
                                    type="text"
                                    clearable
                                    :disabled="loading"
                                    outlined
                                    color="#005598"
                                    dense
                                    counter="20"
                                    :rules="[required('Nombre'), maxLength('Nombre',20), minLength('Nombre',2)]"
                                />
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn 
                                        :dark="valid" 
                                        :disabled="!valid" 
                                        :loading="loading"
                                        class="white--text caption text-capitalize"
                                        @click="save(editItem)"
                                    >
                                        Enviar
                                        <template v-slot:loader>
                                            <span class="custom-loader">
                                                <v-icon>cached</v-icon>
                                            </span>
                                        </template> 
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <Snackbar :exito="exito" :error="error" />
    </v-container>
</template>

<script>
import Snackbar from '@/components/helpers/Snackbar';
import Grupos from '@/services/Grupos';
import url from '@/services/ruta';
import {mapActions} from 'vuex';
import validations from '@/validations/validations';

    export default {
        components:{
            Snackbar,
        },
        data() {
            return {
                ruta:null,
                loading:true,
                exito:null,
                error:null,
                dialog:false,
                editIndex:-1,
                valid:false,
                search:'',
                imagen:null,
                showImage:'',
                grupos:[],
                ...validations,
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Visualizar', value: 'visualizar'},
                    { text: 'posicion', value: 'posicion'},
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
                editItem:{
                    nombre:'',
                    visualizar:1,
                    posicion:1,
                    imagen:'default.png',
                },
                defaultItem:{
                    nombre:'',
                    visualizar:1,
                    posicion:1,
                    imagen:'default.png',
                },
            }
        },
        mounted() {
            this.ruta = url;
            this.showImage=this.ruta+'default.png'
            this.getGrupos();
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Agregar':'Editar';
            }
        },
        watch: {
            dialog(){
                if(!this.dialog){
                    this.loading = false;
                    setTimeout(() => { 
                        this.editIndex = -1;
                        this.editItem = Object.assign({},this.defaultItem);
                        this.showImage=this.ruta+'default.png';
                        this.imagen=null;
                    },300);      
                }
            }
        },
        methods:{
            ...mapActions(['setSnackbar']),

            //LLAMADAS A LA API
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
            deleteGrupos(item){
                Grupos().delete(`/${item.id}`).then(() => {
                    const index = this.grupos.indexOf(item);
                    this.grupos.splice(index,1);
                    this.exito = 'Se elimino el grupo '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo eliminar el Grupo '+item.nombre+'.';
                    this.setSnackbar(true);
                });
            },
            postGrupos(item){
                let formdata = new FormData();
                formdata.append('image',this.imagen);
                formdata.append('data',JSON.stringify(item));

                Grupos().post("/",formdata).then((response) => {
                    this.grupos.push(response.data.data);
                    this.dialog=false;
                    this.exito = 'Se creo el grupo '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                }).catch(e => {
                    console.log(e);
                    this.dialog=false;
                    this.error = 'No se pudo crear el grupo '+item.nombre;
                    this.setSnackbar(true);
                });
            },
            updateGrupos(item){
                Grupos().post(`/${item.id}`,{data:item}).then(() => {
                    Object.assign(this.grupos[this.editIndex],item);
                    this.editIndex = -1;
                    this.dialog=false;
                    this.exito = 'Se actualizo el grupo '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                }).catch(e => {
                    console.log(e);
                    this.dialog=false;
                    this.error = 'No se pudo actualizar el grupo '+item.nombre+'.';
                    this.setSnackbar(true);
                });
            },
            save(item){
                this.loading = true;
                this.error = null;
                this.exito = null;
                if(this.editIndex > -1){
                    this.updateGrupos(item);
                }else{
                    this.postGrupos(item);
                }
            },
            editedItem(item){
                this.dialog = true;
                this.editIndex = this.grupos.indexOf(item);
                this.editItem = Object.assign({},item);
                this.showImage=this.ruta+this.editItem.imagen;
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar este Grupo?') && this.deleteGrupos(item);
            },
            procesoImg(evt){
                if(evt){
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        this.showImage = e.target.result;
                        this.imagen = evt;
                    }
                    reader.readAsDataURL(evt);
                }else{
                    this.imagen = null;
                    this.showImage=this.ruta+this.editItem.imagen;
                }
            },
        }
    }
</script>

<style scope>
    .color{
        background: #eee;
    }
    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }
    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>

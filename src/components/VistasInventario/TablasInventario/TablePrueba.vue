<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="dialog=!dialog">
                Nuevo
                <v-icon dark class="ml-2">
                    add_circle
                </v-icon>
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
            :headers="headers"
            :items="grupos"
            class="elevation-0"
            :search="search"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" width="400" @MouseEvent="close">
            <v-card width="100%">
                <v-card-title class="color">
                    {{title}}
                    <v-spacer></v-spacer>
                    <v-icon @click="close">
                        cancel
                    </v-icon>
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
import {mapActions} from 'vuex';
import validations from '@/validations/validations';

    export default {
        components:{
            Snackbar,
        },
        data() {
            return {
                loading:true,
                exito:null,
                error:null,
                dialog:false,
                editIndex:-1,
                valid:false,
                search:'',
                showImage:'http://192.168.0.253:81/api/images/default.png',
                imagen:null,
                grupos:[],
                ...validations,
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Visualizar', value: 'visualizar' },
                    { text: 'posicion', value: 'posicion' },
                    { text: 'Imagen', value: 'imagen' },
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
                }
            }
        },
        mounted() {
            this.getConceptos();
        },
        watch: {
            grupos(){
                this.loading = false;
            }
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Agregar':'Editar';
            }
        },
        methods:{
            ...mapActions(['setSnackbar']),

            //LLAMADAS A LA API
            getConceptos(){
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteGrupos(item){
                Grupos().delete(`/${item.id}`).then((response) => {
                    console.log(response);
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
                Grupos().post("/",{data:item}).then((response) => {
                    console.log(response);
                    this.exito = 'Se creo el grupo '+item.nombre+' exitosamente.';
                    this.grupos.push(item);
                    this.setSnackbar(true);
                    this.loading = false;
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo crear el grupo '+item.nombre;
                    this.loading =false;
                    this.setSnackbar(true);
                });
            },
            updateGrupos(item){
                Grupos().post(`/${item.id}`,{data:item}).then((response) => {
                    console.log(response);
                    Object.assign(this.grupos[this.editIndex],item);
                    this.editIndex = -1;
                    this.exito = 'Se actualizo el grupo '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                    this.loading = false;
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                    this.error = 'No se pudo actualizar el grupo '+item.nombre+'.';
                    this.setSnackbar(true);
                });
                this.close();
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
                this.error = null;
                this.exito = null;
                this.dialog = true;
                this.editIndex = this.grupos.indexOf(item);
                this.editItem = Object.assign({},item);
            },
            close(){
                this.dialog = false;
                setTimeout(() => { 
                    this.editIndex = -1;
                    this.editItem = Object.assign({},this.defaultItem);
                    this.showImage='http://192.168.0.253:81/api/images/default.png';
                },300);               
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
                }
            },
        }
    }
</script>

<style scope>
    .color{
        background: #eee;
    }
</style>
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
        <v-data-table :headers="headers" :items="marcas" class="elevation-0" :search="search">
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
                    <v-icon @click="dialog=!dialog">cancel</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form v-model="valid" @submit.prevent="" class="pa-5">
                        <v-row>
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
        <Snackbar :error="error" :exito="exito" />
    </v-container>
</template>

<script>
import Marcas from '@/services/Marcas';
import validations from '@/validations/validations';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                dialog:false,
                search:'',
                valid:false,
                loading:false,
                error:null,
                exito:null,
                editIndex:-1,
                marcas:[],
                ...validations,
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                editItem:{
                    nombre:'',
                },
                defaultItem:{
                    nombre:'',
                },
            }
        },
        mounted() {
            this.getMarcas();
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
                    },300);    
                }
            }
        },
        methods:{
            ...mapActions(['setSnackbar']),
            
            getMarcas(){
                Marcas().get("/").then((response) => {
                    this.marcas = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteMarca(item){
                Marcas().delete(`/${item.id}`).then(() => {
                    const index = this.marcas.indexOf(item);
                    this.marcas.splice(index,1);
                    this.exito = 'Se elimino la Marca '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo eliminar la Marca '+item.nombre+'.';
                    this.setSnackbar(true);
                });
            },
            postMarcas(item){
                Marcas().post("/",{data:item}).then((response) => {
                    console.log(response);
                    this.dialog=false;
                    this.marcas.push(item);
                    this.exito = 'Se creo la Marca '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                }).catch(e => {
                    console.log(e);
                    this.dialog=false;
                    this.error = 'No se pudo crear la Marca '+item.nombre+'.';
                    this.setSnackbar(true);
                });
            },
            updateMarca(item){
                Marcas().post(`/${item.id}`,{data:item}).then((response) => {
                    console.log(response);
                    Object.assign(this.marcas[this.editIndex],item);
                    this.editIndex = -1;
                    this.dialog=false;
                    this.exito = 'Se actualizo la Marca '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                }).catch(e => {
                    console.log(e);
                    this.dialog=false;
                    this.error = 'No se pudo actualizar la Marca '+item.nombre+'.';
                    this.setSnackbar(true);
                });
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar esta Marca?') && this.deleteMarca(item);
            },
            editedItem(item){
                this.dialog = true;
                this.editIndex = this.marcas.indexOf(item);
                this.editItem = Object.assign({},item);
            },
            save(item){
                this.loading = true;
                this.error = null;
                this.exito = null;
                if(this.editIndex > -1){
                    this.updateMarca(item);
                }else{
                    this.postMarcas(item);
                }
            },
        }
    }
</script>
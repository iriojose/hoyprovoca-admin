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
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="subgrupos"
            class="elevation-0"
            :items-per-page="7"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" width="400">
            <v-card width="100%" height="600">
                <v-card-title>
                    {{title}}
                    <v-spacer></v-spacer>
                    <v-icon @click="close">
                        cancel
                    </v-icon>
                </v-card-title>
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
                                <v-select 
                                    :items="grupos"
                                    v-model="editItem.grupo"
                                    label="Grupo"
                                    hide-details
                                    hide-selected
                                    dense
                                    color="#005598"
                                    outlined
                                    :rules="[required('Grupo')]"
                                    @change="change($event)"
                                />
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

        <Snackbar :error="error" :exito="exito" />
    </v-container>
</template>

<script>
import SubGrupos from '@/services/SubGrupos';
import Grupos from '@/services/Grupos';
import validations from '@/validations/validations';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                showImage:'http://192.168.0.253:81/api/images/default.png',
                imagen:null,
                exito:null,
                error:null,
                valid:false,
                dialog:false,
                loading:false,
                subgrupos:[],
                grupos:[],
                ...validations,
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Grupo',sortable: true, value: 'grupo' },
                    { text: 'Visualizar', value: 'visualizar' },
                    { text: 'posicion', value: 'posicion' },
                    { text: 'Imagen', value: 'imagen' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                editIndex:-1,
                editItem:{
                    nombre:'',
                    grupo:'',
                    grupos_id:0,
                    visualizar:1,
                    posicion:1,
                    imagen:'default.png',
                },
                defaultItem:{
                    nombre:'',
                    grupo:'',
                    grupos_id:0,
                    visualizar:1,
                    posicion:1,
                    imagen:'default.png',
                }

            }
        },
        mounted(){
            this.getSubgrupos();
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Agregar':'Editar';
            }
        },
        methods:{
            ...mapActions(['setSnackbar']),

            getSubgrupos(){
                SubGrupos().get("/").then((response) => {
                    this.subgrupos = response.data.data;
                    this.getGrupos();
                }).catch(e => {
                    console.log(e);
                });
            },
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                    this.refactor(response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            },
            postSubgrupos(item){
                SubGrupos().post("/",{data:item}).then((response) => {
                    console.log(response);
                    this.exito = 'Se creo el Subgrupo exitosamente.';
                    this.subgrupos.push(item);
                    this.setSnackbar(true);
                    this.loading =false;
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo crear este Subgrupo.';
                    this.setSnackbar(true);
                    this.loading = false;
                });
            },
            updateSubgrupos(item){
                SubGrupos().post(`/${item.id}`,{data:item}).then((response) => {
                    console.log(response);
                    const index = this.subgrupos.indexOf(item);
                    this.subgrupos[index]=item;
                    this.editIndex = -1;
                    this.exito = 'Se actualizo el Subgrupo exitosamente'
                    this.setSnackbar(true);
                    this.loading = false;
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo actualizar este Subgrupo.';
                    this.setSnackbar(true);
                    this.loading = false;
                });
            },
            deleteSubgrupos(item){
                SubGrupos().delete(`/${item.id}`).then((response) => {
                    console.log(response);
                    this.exito = 'Se elimino el subgrupo exitosamente.';
                    this.setSnackbar(true);
                    const index = this.subgrupos.indexOf(item);
                    this.subgrupos.splice(index,1);
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo eliminar este Subgrupo.';
                    this.setSnackbar(true);
                });
            },
            refactor(array){
                for (let i = 0; i < this.subgrupos.length; i++) {
                    for (let e = 0; e < array.length; e++) {
                        this.grupos[e].text = array[e].nombre;
                        if(this.subgrupos[i].grupos_id == array[e].id){
                            this.subgrupos[i].grupo = array[e].nombre;
                        }
                    }
                }
            },
            change(evt){
                for (let i = 0; i < this.grupos.length; i++) {
                    if(this.grupos[i].nombre == evt){
                        this.editItem.grupos_id = this.grupos[i].id;
                    }
                }
                console.log(this.editItem);
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
            save(item){
                this.loading = true;
                this.error = null;
                this.exito = null;
                const index = this.subgrupos.indexOf(item);
                if(index > -1){
                    this.updateSubgrupos(item);
                }else{
                    this.postSubgrupos(item);
                }
            },
            editedItem(item){
                this.error = null;
                this.exito = null;
                this.dialog = true;
                this.editItem = item;
                this.editIndex = this.subgrupos.indexOf(item);
            },
            close(){
                this.dialog = false;
                this.editIndex = -1;
                this.editItem = this.defaultItem;
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar este Subgrupo?') && this.deleteSubgrupos(item);
            }
        }
    }
</script>
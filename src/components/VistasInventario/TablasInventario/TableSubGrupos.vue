<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="dialog = !dialog">
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
            :items="subgrupos"
            class="elevation-0"
            :search="search"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" width="400" @MouseEvent="close">
            <v-card width="100%" height="600">
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
                                    label="Imagen SubGrupo"
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
import url from '@/services/ruta';
import validations from '@/validations/validations';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                ruta:null,
                showImage:null,
                imagen:null,
                exito:null,
                error:null,
                valid:false,
                dialog:false,
                loading:false,
                search:'',
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
            this.ruta = url;
            this.showImage=this.ruta+'default.png';
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
                    this.getGrupos(response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            },
            getGrupos(subgrupos){
                Grupos().get("/").then((response) => {
                    this.refactor(subgrupos,response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            },
            refactor(subgrupos,grupos){
                for (let i = 0; i < subgrupos.length; i++) {
                    for (let e = 0; e < grupos.length; e++) {
                        if(subgrupos[i].grupos_id == grupos[e].id){
                            subgrupos[i].grupo = grupos[e].nombre;
                        }
                    }
                }
                this.refactorGrupos(grupos);
                this.subgrupos = subgrupos;

            },
            refactorGrupos(grupos){
                for (let i = 0; i < grupos.length; i++) {
                    grupos[i].text = grupos[i].nombre;
                }
                this.grupos = grupos;
            },
            change(evt){
                for (let i = 0; i < this.grupos.length; i++) {
                    if(this.grupos[i].nombre == evt){
                        this.editItem.grupos_id = this.grupos[i].id;
                    }
                }
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
            //Metodos del crud y llamadas a la api
            postSubgrupos(item){
                delete item.grupo;
                let formdata = new FormData();
                formdata.append('image',this.imagen);
                formdata.append('data',JSON.stringify(item));
                SubGrupos().post("/",formdata).then((response) => {
                    console.log(response);
                    this.exito = 'Se creo el subgrupo '+item.nombre+' exitosamente.';
                    this.subgrupos.push(response.data.data);
                    this.setSnackbar(true);
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo crear el subgrupo '+item.nombre;
                    this.setSnackbar(true);
                    this.close();
                });
            },
            updateSubgrupos(item){
                const aux = item.grupo;
                delete item.grupo;
                SubGrupos().post(`/${item.id}`,{data:item}).then((response) => {
                    console.log(response);
                    item.grupo = aux;
                    Object.assign(this.subgrupos[this.editIndex],item);
                    this.editIndex = -1;
                    this.exito = 'Se actualizo el subgrupo '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo actualizar el subgrupo '+item.nombre+'.';
                    this.setSnackbar(true);
                    this.close();
                });
            },
            deleteSubgrupos(item){
                SubGrupos().delete(`/${item.id}`).then((response) => {
                    console.log(response);
                    this.exito = 'Se elimino el subgrupo '+item.nombre+' exitosamente.';
                    this.setSnackbar(true);
                    const index = this.subgrupos.indexOf(item);
                    this.subgrupos.splice(index,1);
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo eliminar el Grupo '+item.nombre+'.';
                    this.setSnackbar(true);
                });
            },
            save(item){
                this.loading = true;
                this.error = null;
                this.exito = null;
                if(this.editIndex > -1){
                    this.updateSubgrupos(item);
                }else{
                    this.postSubgrupos(item);
                }
            },
            editedItem(item){
                this.error = null;
                this.exito = null;
                this.dialog = true;
                this.editIndex = this.subgrupos.indexOf(item);
                this.editItem = Object.assign({},item);
                this.showImage=this.ruta+this.editItem.imagen;
            },
            close(){
                this.loading = false;
                this.dialog = false;
                setTimeout(() => {
                    this.editIndex = -1;
                    this.editItem = Object.assign({},this.defaultItem);
                    this.showImage=this.ruta+'default.png';
                },300);
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar este Subgrupo?') && this.deleteSubgrupos(item);
            }
        }
    }
</script>

<style scope>
    .color{
        background: #eee;
    }
</style>
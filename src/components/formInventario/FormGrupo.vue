<template>
    <v-container>
        <v-toolbar flat color="white">
            <v-toolbar-title>Grupos</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="#005598" dark class="mb-2" @click="dialog=!dialog">
                Nuevo <v-icon dark class="mx-2">add_circle</v-icon>
            </v-btn>
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="grupos"
            sort-by="id"
            class="elevation-0"
        >  
            <template v-slot:item.action="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                >
                    edit
                </v-icon>
                <v-icon
                    small
                    @click="deleteItem(item)"
                >
                    delete
                </v-icon>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-card-title>
                    Agregar
                    <v-spacer></v-spacer>
                    <v-icon @click="dialog = false">
                        cancel
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    <v-form v-model="valid" @submit.prevent="">
                        <v-card width="100%" elevation="0" height="500" class="pa-5">
                            <v-row>
                                <v-col cols="12" md="12" sm="12">
                                    <v-card width="100%" height="220" class="pa-2" elevation="0">
                                        <v-img height="200" contain :src="showImage" />
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-file-input
                                        :rules="rules"
                                        accept="image/png, image/jpeg, image/bmp"
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
                                        v-model="data.nombre"
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
                                            class="white--text caption"
                                        >
                                            Enviar
                                        </v-btn>
                                        <v-btn class="caption" @click="dialog = false">cancelar</v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-form>
                </v-card-text>  
                
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="error ? '#C62828':'#2E7D32'" right>
            <div v-if="error">
                <v-icon dark>
                    cancel
                </v-icon>
                {{error}}
            </div>
            <div v-else>
                <v-icon dark>
                    check_circle
                </v-icon>
                La instrucción se ejecuto exitosamente.
            </div>
        </v-snackbar>
    </v-container>
</template>

<script>
import Grupos from '@/services/Grupos';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                dialog: false,
                headers: [
                    {text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Visualizar', value: 'visualizar' },
                    { text: 'posicion', value: 'posicion' },
                    { text: 'Imagen', value: 'imagen' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                grupos:[],
                valid:false,
                snackbar:false,
                error:null,
                imagen:null,
                showImage:'http://localhost:81/api/images/default.png',
                ...validations,
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
                data:{
                    nombre:'',
                    visualizar:1,
                    posicion:1,
                    imagen:"default.png"
                }
            }
        },
        mounted() {
            this.getGrupos();
        },
        methods: {
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteGrupos(item){
                Grupos().delete(`/${item.id}`).then((response) =>{
                    console.log(response);
                    const index = this.grupos.indexOf(item);
                    this.grupos.splice(index, 1);
                    this.snackbar=true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar=true;
                    this.error="Ocurrio un error.";
                });
            },
            updateGrupos(item){
                Grupos().post(`/${item.id}`).then((response) => {
                    console.log(response);
                    const index = this.grupos.indexOf(item);
                    this.grupos[index]=item;
                    this.snackbar=true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar=true;
                    this.error="Ocurrio un error.";
                })
            },
            postGrupos(){
                this.error=null;
                Grupos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.snackbar=true;
                    this.grupos.push(this.data);
                }).catch(e => {
                    console.log(e);
                    this.snackbar=true;
                    this.error="Ocurrio un error.";
                });
            },
            procesoImg(evt){
                this.showImage=null;
                if(evt){
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        this.showImage = e.target.result;
                        this.imagen = evt;
                    }
                    reader.readAsDataURL(evt);
                }
            },
            deleteItem(item){
                confirm('¿Esta seguro de eliminar este Grupo?') && this.deleteGrupos(item);
            },
            editItem(item){
                console.log(item);
            }
        },    
    }
</script>
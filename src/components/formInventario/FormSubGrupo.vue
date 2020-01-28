<template>
    <div>
        <v-container>
            <v-toolbar flat color="white">
                <v-toolbar-title>SubGrupos</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="#005598" dark class="mb-2" @click="dialog=!dialog">
                    Nuevo <v-icon dark class="mx-2">add_circle</v-icon>
                </v-btn>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="subgrupos"
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
        </v-container>

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
                Se ha registrado exitosamente.
            </div>
        </v-snackbar>
    </div>

    <!-- <v-form v-model="valid" @submit.prevent="">  
        <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" md="4" sm="12">
                <v-card width="100%" height="600" elevation="5" class="pa-5">
                    <v-row>
                         <v-col cols="12" md="12" sm="12">
                            <v-card width="100%" height="220" class="pa-2">
                                <v-img height="200" contain v-if="showImage" :src="showImage" />
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-file-input
                                :rules="rules"
                                accept="image/png, image/jpeg, image/bmp"
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
                            <v-select
                                :items="grupos"
                                label="Grupos"
                                outlined
                                dense
                                hide-selected
                                hide-details
                                :rules="[required('Grupo')]"
                                color="#005598"
                                @change="change($event)"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-btn 
                                block
                                color="#005598" 
                                width="100%" 
                                :dark="valid" 
                                :disabled="!valid" 
                                class="white--text caption"
                                @click="postSubGrupos"
                            >
                                Enviar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-form>-->
</template>

<script>
import SubGrupos from '@/services/SubGrupos';
import Grupos from '@/services/Grupos';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                dialog: false,
                headers: [
                    {text: 'Id',align: 'left',sortable: true,value:'id',},
                    {text: 'Nombre',sortable: true, value: 'nombre' },
                    {text:'Grupo',sortable:true,value:'grupo'},
                    { text: 'Visualizar', value: 'visualizar' },
                    { text: 'posicion', value: 'posicion' },
                    { text: 'Imagen', value: 'imagen' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                grupos:[],
                subgrupos:[],
                snackbar:false,
                error:null,
                valid:false,
                imagen:null,
                showImage:'http://localhost:81/api/images/default.png',
                data:{
                    nombre:'',
                    visualizar:1,
                    posicion:1,
                    imagen:"default",
                    grupos_id:''
                },
                ...validations,
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
            }
        },
        mounted() {
            this.getGrupos();
        },
        methods: {
            refactorGrupos(){
                for (let i = 0; i < this.subgrupos.length; i++) {
                    for (let e = 0; e < this.grupos.length; e++) {
                       if(this.subgrupos[i].grupos_id == this.grupos[e].id){
                           this.subgrupos[i].grupo = this.grupos[e].nombre;
                       }
                    }
                }
            },
            refactorVariable(array){//crea una propiedad text para que se pueda leer en los select
                array.filter(value => value.text=value.nombre);
                return array;
            },
            change(evt){
                let aux = this.grupos.filter(a => a.nombre == evt);
                this.data.grupos_id = aux[0].id;
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
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos=response.data.data;
                    this.getSubGrupos();
                    this.grupos=this.refactorVariable(this.grupos);
                }).catch(e => {
                    console.log(e);
                });
            },
            getSubGrupos(){
                SubGrupos().get("/").then((response) => {
                    this.subgrupos = response.data.data;
                    this.refactorGrupos();
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteSubgrupos(item){
                SubGrupos().delete(`/${item.id}`).then((response) => {
                    console.log(response);
                    const index = this.subgrupos.indexOf(item);
                    this.subgrupos.splice(index, 1);
                    this.snackbar = true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar = true;
                    this.error="Ocurrio un error.";
                });
            },
            updateSubgrupos(item){
                SubGrupos().post(`/${id}`,{data:this.data}).then((response) => {
                    console.log(response);
                    const index = this.subgrupos.indexOf(item);
                    this.subgrupos[index] = response.data.data;
                    this.snackbar = true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar = true;
                    this.error="Ocurrio un error.";
                });
            },
            postSubGrupos(){
                this.error=null;
                SubGrupos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.snackbar = true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar = true;
                    this.error="Ocurrio un error.";
                });
            },
            deleteItem(item){
                confirm('¿Esta seguro de eliminar este SubGrupo?') && this.deleteSubGrupos(item);
            },
            editItem(item){
                console.log(item);
            }
        },        
    }
</script>

<template>
    <div>
        <v-card width="100%">
            <v-toolbar flat color="#fff">
                <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="dialog=!dialog">
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
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
            </v-toolbar>
            <v-data-table 
                :loading="loading && '#005598'" 
                loading-text="Loading... Please wait" 
                :headers="headers" 
                :items="grupos" 
                class="elevation-0" 
                :search="search"
            >   
                <template v-slot:item.imagen="{item}">
                    <v-avatar size="50">
                        <v-img :src="image+item.imagen"></v-img>
                    </v-avatar>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2">mdi-border-color</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" width="400" class="py-12" transition="dialog-bottom-transition">
            <v-card height="215">
                <v-card-text>
                    <v-row justify="center" align="center"> 
                        <LoaderRect v-if="loading2" class="py-12" />
                        <div v-if="!loading2 && valor == null && !eliminado" class="text-center title font-weight-bold py-12">
                            ¿Seguro que quiere eliminar este Grupo? 
                            <v-row justify="space-around">
                                <div>
                                    <v-hover v-slot:default="{hover}">
                                        <v-btn 
                                            :elevation="hover ? 3:1" 
                                            :text="hover ? false:true" 
                                            :color="hover ? '#005598':null"
                                            :dark="hover ? true:false"
                                            class="text-capitalize"
                                            block
                                            :loading="loading2"
                                            @click="deleteGrupo()"
                                        >
                                            Sí, seguro
                                        </v-btn>
                                    </v-hover>
                                </div>

                                <div>
                                    <v-hover v-slot:default="{hover}">
                                        <v-btn 
                                            :elevation="hover ? 3:1" 
                                            :text="hover ? false:true" 
                                            :color="hover ? '#005598':null"
                                            :dark="hover ? true:false"
                                            class="text-capitalize"
                                            block
                                            @click="dialog = !dialog"
                                        >
                                            No, volver
                                        </v-btn>
                                    </v-hover>
                                </div>
                            </v-row>
                        </div>
                        <div v-if="!loading2 && valor" class="py-12 text-center title font-weight-bold">
                            No se puede eliminar este Grupo.
                            <div>
                                <v-icon size="50" color="#D32F2F">
                                    mdi-alert-octagon
                                </v-icon>
                            </div>
                        </div>

                        <div v-if="eliminado" class="py-12 text-center title font-weight-bold">
                            Se elimino el Grupo exitosamente.
                            <div>
                                <v-icon size="50" color="#388E3C">
                                    mdi-checkbox-marked-circle-outline
                                </v-icon>
                            </div>
                        </div>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Grupos from '@/services/Grupos';
import variables from '@/services/variables_globales';
import Conceptos from '@/services/Conceptos';
import LoaderRect from '@/components/loaders/LoaderRect';

    export default {
        components:{
            LoaderRect
        },
        data() {
            return {
                ...variables,
                eliminado:false,
                valor:null,
                bandera:null,
                search:'',
                dialog:false,
                loading2:false,
                loading:true,
                grupos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Visualizar', value: 'visualizar'},
                    { text: 'posicion', value: 'posicion'},
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        mounted() {
            this.getGrupos();
        },
        watch:{
            dialog(){
                setTimeout(()=> { 
                    if(!this.dialog){
                        this.valor=null;
                        this.eliminado=false;
                    } 
                },500);
            }
        },
        methods: {
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                    this.loading=false;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteGrupo(){
                this.eliminado = false;
                this.loading2=true;
                Grupos().delete(`/${this.bandera.id}`).then(() => {
                    this.loading2=false;
                    this.eliminado = true;
                    const index = this.grupos.indexOf(this.bandera);
                    this.grupos.splice(index,1);
                }).catch(e => {
                    console.log(e);
                });
            },
            getConcepto(item){
                Conceptos().get(`/?limit=1&adm_grupos_id=${item.id}`).then((response) => {
                    this.valor = response.data.data;
                    console.log(response);
                    this.loading2 = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteItem(item){
                this.bandera=item;
                this.dialog = true;
                this.loading2 = true;
                this.getConcepto(item);
            }
        },
    }
</script>
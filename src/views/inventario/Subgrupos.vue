<template>
    <div>
        <v-card width="100%" v-if="$route.name == 'subgrupos'">
            <v-card-title>
                <v-btn 
                    color="#005598" dark 
                    class="mb-2 text-capitalize caption" 
                    @click="dialogSubrupo = true"
                >
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
                </v-btn>
                <v-btn 
                    @click="getSubgrupos()" 
                    dark 
                    class="mb-2 mx-2 text-capitalize caption" 
                    color="#005598"
                    :disabled="bloqueado"
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
                    solo
                    hide-details
                    dense
                />
            </v-card-title>
            <v-card-text>
                <v-data-table 
                    :loading="loading && '#005598'" 
                    loading-text="Loading... Please wait" 
                    :headers="headers" 
                    :items="subgrupos" 
                    class="elevation-0" 
                    :search="search"
                >   
                    <template v-slot:item.imagen="{item}">
                        <v-avatar size="50">
                            <v-img :src="image+item.imagen"></v-img>
                        </v-avatar>
                    </template>
                    
                    <template slot="loading">
                        <LoaderRect class="mb-12"/> 
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-icon :small="$vuetify.breakpoint.smAndDown ? false:true" class="mr-2" @click="editar(item)" >mdi-border-color</v-icon>
                        <v-icon :small="$vuetify.breakpoint.smAndDown ? false:true" @click="deleteItem(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!--modal para eliminar un subgrupo -->

        <ModalDeleteSubgrupo :dialog="dialogBorrar">
            <template v-slot:close>
                <v-btn fab small text @click="dialogBorrar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
            <template v-slot:close2>  
                <v-btn elevation="3" color="#fff" class="text-capitalize" @click="dialogBorrar = false">
                    No, volver
                </v-btn>
            </template>
        </ModalDeleteSubgrupo>
    </div>
</template>

<script>
import SubGrupos from '@/services/SubGrupos';
import LoaderRect from '@/components/loaders/LoaderRect';
import variables from '@/services/variables_globales';
import ModalDeleteSubgrupo from '@/components/dialogs/ModalDeleteSubgrupo';

    export default {
        components:{
            LoaderRect,
            ModalDeleteSubgrupo
        },
        data(){
            return {
                ...variables,
                loading:false,
                dialogSubrupo:false,
                dialogBorrar:false,
                dialogEditar:false,
                showMessage:false,
                eliminado:false,
                bandera:{
                    imagen:'default.png'
                },
                offset:0,
                total:0,
                search:'',
                subgrupos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Visualizar', value: 'visualizar'},
                    { text: 'posicion', value: 'posicion'},
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        watch:{
            dialogBorrar(){
                if (!this.dialogBorrar) {
                    if(this.eliminado) {
                        this.subgrupos.filter((a,i) => a.id == this.bandera.id ? this.subgrupos.splice(i,1):null)
                        this.eliminado = false;
                    }
                }
            },
        },
        computed:{
            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.subgrupos.length == this.total) return true;
                else return false;
            }
        },
        mounted() {
            this.getSubgrupos();
        },
        methods:{
            getSubgrupos(){//obtiene todos los grupos
                this.loading = true;
                SubGrupos().get(`/?limit=50&offset=${this.offset}&order=desc`).then((response) => {
                    response.data.data.filter(a => this.subgrupos.push(a));
                    this.offset+=50;
                    this.total= response.data.totalCount;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteItem(item){
                this.dialogBorrar = true;
                this.bandera = Object.assign({},item);
            },
            editar(item){//envia a la ruta editar
                this.dialogEditar = true;
                this.bandera = Object.assign({},item);
            },
        }
    }
</script>

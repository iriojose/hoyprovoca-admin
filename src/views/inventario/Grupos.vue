<template>
    <div>
        <v-card width="100%" v-if="$route.name == 'grupos'">
            <v-card-title>
                <v-btn 
                    color="#005598" dark 
                    class="mb-2 text-capitalize caption" 
                    @click="dialogGrupo = true"
                >
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
                </v-btn>
                <v-btn 
                    @click="getGrupos()" 
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
                    :items="grupos" 
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

        <!--modal para crear un grupo -->

        <ModalCreateGrupo :dialog="dialogGrupo">
            <template v-slot:close>
                <v-btn fab small text @click="dialogGrupo = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </ModalCreateGrupo>

        <!--modal para editar un grupo -->
        <ModalEditGrupo :dialog="dialogEditar" :grupo="bandera">
            <template v-slot:close>
                <v-btn fab small text @click="dialogEditar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </ModalEditGrupo>

        <!--modal para eliminar un grupo -->
        <ModalDeleteGrupo :dialog="dialogBorrar">
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
        </ModalDeleteGrupo>
    </div>
</template>

<script>
import Grupos from '@/services/Grupos';
import LoaderRect from '@/components/loaders/LoaderRect';
import variables from '@/services/variables_globales';
import ModalDeleteGrupo from '@/components/dialogs/ModalDeleteGrupo';
import ModalCreateGrupo from '@/components/dialogs/ModalCreateGrupo';
import ModalEditGrupo from '@/components/dialogs/ModalEditGrupo';

    export default {
        components:{
            LoaderRect,
            ModalCreateGrupo,
            ModalEditGrupo,
            ModalDeleteGrupo
        },
        data(){
            return {
                ...variables,
                loading:false,
                dialogGrupo:false,
                dialogBorrar:false,
                dialogEditar:false,
                eliminado:false,
                creado:false,
                icon:'',
                color:'',
                mensaje:'',
                total:0,
                offset:0,
                search:'',
                bandera:{
                    imagen:'default.png'
                },
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
        computed:{
            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.grupos.length == this.total) return true;
                else return false;
            }
        },
        watch: {
            dialogBorrar(){
                if (!this.dialogBorrar) {
                    if(this.eliminado) {
                        this.grupos.filter((a,i) => a.id == this.bandera.id ? this.grupos.splice(i,1):null)
                        this.eliminado = false;
                    }
                }
            },
            dialogGrupo(){
                if(!this.dialogGrupo){
                    if(this.creado){
                        this.grupos.unshift(this.bandera);
                        this.creado = false;
                    }
                }
            },
            dialogEditar(){
                if (!this.dialogEditar) {
                    this.grupos.filter(a => a.id == this.bandera.id ? Object.assign(a,this.bandera):null);
                }
            }
        },
        mounted(){
            this.getGrupos();
        },
        methods:{
            getGrupos(){//obtiene todos los grupos
                this.loading = true;
                Grupos().get(`/?limit=50&offset=${this.offset}&order=desc`).then((response) => {
                    response.data.data.filter(a => this.grupos.push(a));
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
            close(){//cierra el modal
                this.dialogBorrar = false;
                this.eliminado = false;
            },
        }  
    }
</script>
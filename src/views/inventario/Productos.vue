<template>
    <div>
        <v-card width="100%" v-if="$route.name == 'productos'">
            <v-card-title>
                <v-btn 
                    color="#005598" dark 
                    class="mb-2 text-capitalize caption" 
                    @click="dialogConcepto = true"
                >
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
                </v-btn>
                <v-btn 
                    @click="getConceptos()" 
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
                    :items="conceptos" 
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

        <!--modal para eliminar un producto -->
        <ModalDeleteProducto :dialog="dialogBorrar">
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
        </ModalDeleteProducto>

        <!--modal para crear un producto -->
        
        <ModalCreateProducto :dialog="dialogConcepto">
            <template v-slot:close>
                <v-btn fab small text @click="dialogConcepto = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </ModalCreateProducto>
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';
import LoaderRect from '@/components/loaders/LoaderRect';
import variables from '@/services/variables_globales';
import {mapState} from 'vuex';
import accounting from 'accounting';
import ModalDeleteProducto from '@/components/dialogs/ModalDeleteProducto';
import ModalCreateProducto from '@/components/dialogs/ModalCreateProducto';

    export default {
        components:{
            LoaderRect,
            ModalDeleteProducto,
            ModalCreateProducto
        },
        data() {
            return {
                ...variables,
                loading:false,
                dialogConcepto:false,
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
                conceptos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Codigo', value: 'codigo'},
                    //{ text: 'Referencia', value: 'referencia'},
                    { text: 'Grupo', value: 'grupo.nombre'},
                    { text: 'Subgrupo', value: 'subgrupo.nombre'},
                    { text: 'Precio Bs', value: 'precio_a'},
                    { text: 'Precio $', value: 'precio_dolar'},
                    //{ text: 'Existencia', value: 'existencias[0].existencia'},
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        mounted(){
            this.getConceptos();
        },
         computed: {
            ...mapState(['user']),

            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.conceptos.length == this.total) return true;
                else return false;
            }
        },
        watch: {
            dialogBorrar(){
                if (!this.dialogBorrar) {
                    if(this.eliminado) {
                        this.conceptos.filter((a,i) => a.id == this.bandera.id ? this.conceptos.splice(i,1):null)
                        this.eliminado = false;
                    }
                }
            },
            dialogConcepto(){
                if(!this.dialogConcepto){
                    if(this.creado){
                        this.conceptos.unshift(this.bandera);
                        this.creado = false;
                    }
                }
            },
            dialogEditar(){
                if (!this.dialogEditar) {
                    this.conceptos.filter(a => a.id == this.bandera.id ? Object.assign(a,this.bandera):null);
                }
            }
        },
        methods:{
            getConceptos(){
                this.loading = true;
                Empresa().get(`/${this.user.data.adm_empresa_id}/conceptos/?limit=50&offset=${this.offset}&fields=grupo,subgrupo`).then((response) => {
                    this.total= response.data.totalCount;
                    response.data.data.filter(a => a.precio_a = accounting.formatMoney(+a.precio_a,{symbol:"Bs ",thousand:'.',decimal:','}));
                    response.data.data.filter(a => a.precio_dolar = accounting.formatMoney(+a.precio_dolar,{symbol:"$",thousand:',',decimal:'.'}));
                    response.data.data.filter(a => this.conceptos.push(a));
                    this.loading=false;
                    this.offset+=50;
                    console.log(response.data);
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
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

<style lang="scss" scoped>

</style>
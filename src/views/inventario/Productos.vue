<template>
    <div>
        <v-card  width="100%">
            <v-card-title>
                <v-btn 
                    color="#2950c3" tile @click="dialogCrear = true"
                    class="text-capitalize white--text rounded"
                >
                    Nuevo
                    <v-icon color="#fff" class="mx-2">mdi-plus-circle</v-icon>
                </v-btn>
                <v-spacer class="hidden-sm-and-up"></v-spacer>
                <v-btn 
                    color="#2950c3" tile 
                    class="mx-2 text-capitalize white--text rounded" 
                    :loading="loading" @click="getConceptos()" :disabled="bloqueado"
                >   
                    Ver más
                    <v-icon color="#fff" class="mx-2">mdi-chevron-right</v-icon>
                </v-btn>
                <v-spacer class="hidden-sm-and-down"></v-spacer>
                <v-spacer class="hidden-sm-and-down"></v-spacer>
                <v-spacer class="hidden-sm-and-down"></v-spacer>
                <v-text-field
                    class="mx-2 mt-2" append-icon="mdi-magnify"
                    v-model="search" dense
                    hide-details color="#2950c3"
                    filled single-line
                    rounded label="Buscar..."
                ></v-text-field>
            </v-card-title>

            <v-card-text>
                <v-data-table
                    :loading="loading && '#2950c3'" 
                    :headers="headers" 
                    :items="productos" 
                    class="elevation-0" 
                    :search="search"
                >
                    <!--template de la imagen -->
                    <template v-slot:item.imagen="{item}">
                        <v-avatar size="50" tile>
                            <v-img :src="image+item.imagen"></v-img>
                        </v-avatar>
                    </template>
                    <!--template del loader -->
                    <template slot="loading">
                        <v-card width="100%" height="600" elevation="0">
                            <v-row justify="center" class="fill-height" align="center">
                                <Puntos />
                            </v-row>
                        </v-card>
                    </template>
                    <!--template de las acciones -->
                    <template v-slot:item.action="{ item }">
                        <v-icon :small="$vuetify.breakpoint.smAndDown ? false:true" class="mr-2" @click="editItem(item)">mdi-border-color</v-icon>
                        <v-icon :small="$vuetify.breakpoint.smAndDown ? false:true" @click="deleteItem(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!--modal para crear producto -->
        <!--CrearGrupo :dialog="dialogCrear">
            <template v-slot:close>
                <v-btn tile color="#232323" text @click="dialogCrear = false">
                    Cancelar
                </v-btn>
            </template>
            <template v-slot:salir>
                <v-btn fab small color="#fff" @click="dialogCrear = false">
                    <v-icon color="#232323">mdi-close</v-icon>
                </v-btn>
            </template>
        </CrearGrupo-->

        <!--modal para eliminar producto -->
        <EliminarProducto :dialog="dialogBorrar">
            <template v-slot:close>
                <v-btn tile @click="dialogBorrar = false" :disabled="eliminado">
                    Volver
                </v-btn>
            </template>
            <template v-slot:salir>
                <v-btn fab small color="#fff" @click="dialogBorrar = false">
                    <v-icon color="#232323">mdi-close</v-icon>
                </v-btn>
            </template>
        </EliminarProducto>

        <!-- modal para editar grupo -->
        <!--EditarGrupo :dialog="dialogEditar">
            <template v-slot:close>
                <v-btn tile color="#232323" text @click="dialogEditar = false">
                    Cancelar
                </v-btn>
            </template>
            <template v-slot:salir>
                <v-btn fab small color="#fff" @click="dialogEditar = false">
                    <v-icon color="#232323">mdi-close</v-icon>
                </v-btn>
            </template>
        </EditarGrupo-->
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';
import variables from '@/services/variables_globales';
import Puntos from '@/components/loaders/Puntos';
import accounting from 'accounting';
import {mapState} from 'vuex';
//import CrearGrupo from '@/components/modals/CrearGrupo';
import EliminarProducto from '@/components/modals/EliminarProducto';
//import EditarGrupo from '@/components/modals/EditarGrupo';

    export default {
        components: {
            Puntos,
            //CrearGrupo,
            EliminarProducto,
            //EditarGrupo
        },
        data(){
            return {
                //variables del crud
                creado:false,
                eliminado:false,
                editado:false,
                bandera:{
                    imagen:'default.png'
                },
                //variables de las tablas
                ...variables,
                total:0,
                offset:0,
                search:'',
                loading:false,
                dialogCrear:false,
                dialogBorrar:false,
                dialogEditar:false,
                productos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Codigo', value: 'codigo'},
                    //{ text: 'Referencia', value: 'referencia'},
                    { text: 'Grupo', value: 'grupo.nombre'},
                    { text: 'Subgrupo', value: 'subgrupo.nombre'},
                    { text: 'Precio Bs', value: 'precio_a'},
                    { text: 'Precio $', value: 'precio_dolar'},
                    { text: 'Existencia', value: 'existencias[0].existencia'},
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        computed:{
            ...mapState(['user']),

            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.productos.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('productos'));

            if(data) {
                this.productos = data.productos;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getConceptos();
        },
        watch: {
            dialogCrear(){
                if(!this.dialogCrear){
                    if(this.creado){
                        this.total +=1;
                        this.productos.unshift(this.bandera);
                        window.localStorage.setItem('productos',JSON.stringify({productos:this.productos,total:this.total,offset:this.offset}));
                        this.creado = false;
                    }
                }
            },
            dialogBorrar(){
                if (!this.dialogBorrar) {
                    if(this.eliminado) {
                        this.total -=1;
                        this.productos.filter((a,i) => a.id == this.bandera.id ? this.productos.splice(i,1):null);
                        window.localStorage.setItem('productos',JSON.stringify({productos:this.productos,total:this.total,offset:this.offset}));
                        this.eliminado = false;
                    }
                }
            },
            dialogEditar(){
                if(!this.dialogEditar){
                    if(this.editado){
                        this.productos.filter((a,i) => a.id == this.bandera.id ? Object.assign(this.productos[i],this.bandera):null);
                        window.localStorage.setItem('productos',JSON.stringify({productos:this.productos,total:this.total,offset:this.offset}));
                        this.editado = false;
                    }
                }
            }
        },
        methods:{
            getConceptos(){
                this.loading = true;
                Empresa().get(`/${this.user.data.adm_empresa_id}/conceptos/?limit=50&offset=${this.offset}&fields=grupo,subgrupo,existencias`).then((response) => {
                    this.total= response.data.totalCount;
                    this.offset+=50;
                    response.data.data.filter(a => a.precio_a = accounting.formatMoney(+a.precio_a,{symbol:"Bs ",thousand:'.',decimal:','}));
                    response.data.data.filter(a => a.precio_dolar = accounting.formatMoney(+a.precio_dolar,{symbol:"$",thousand:',',decimal:'.'}));
                    response.data.data.filter(a => this.productos.push(a));
                    window.localStorage.setItem('productos',JSON.stringify({productos:this.productos,total:this.total,offset:this.offset}));
                    this.loading=false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
            deleteItem(item){
                this.bandera = Object.assign({},item);
                this.dialogBorrar = true;
            },
            editItem(item){
                this.bandera = Object.assign({},item);
                this.dialogEditar = true;
            }
        }        
    }
</script>

<style lang="scss" scoped>
    .rounded{
        border-radius:5px;
    }
</style>
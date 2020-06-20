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
                    :loading="loading" @click="getEmpresas()" :disabled="bloqueado"
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
                    :items="empresas" 
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

        <CrearEmpresa :dialog="dialogCrear">
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
        </CrearEmpresa>

        <EliminarEmpresa :dialog="dialogBorrar">
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
        </EliminarEmpresa>

        <!-- modal para editar empresa -->
        <EditarEmpresa :dialog="dialogEditar">
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
        </EditarEmpresa>
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';
import variables from '@/services/variables_globales';
import Puntos from '@/components/loaders/Puntos';
import CrearEmpresa from '@/components/modals/CrearEmpresa';
import EliminarEmpresa from '@/components/modals/EliminarEmpresa';
import EditarEmpresa from '@/components/modals/EditarEmpresa';

    export default {
        components: {
            Puntos,
            CrearEmpresa,
            EliminarEmpresa,
            EditarEmpresa
        },
        data(){
            return {
                //variables del crud
                creado:false,
                eliminado:false,
                bandera:{
                    imagen:"default.png"
                },
                editado:false,
                //variables de las tablas
                ...variables,
                total:0,
                offset:0,
                search:'',
                loading:false,
                dialogCrear:false,
                dialogBorrar:false,
                dialogEditar:false,
                empresas:[],
                headers: [
                    { text: 'Imagen',align:'left',sortable: true,value:'imagen',},
                    { text: 'Rif',sortable: true, value: 'rif' },
                    { text: 'Nombre', value: 'nombre_comercial' },
                    { text: 'Registrada', value: 'fecha_registro'},
                    { text: 'Telefono', value: 'telefono1' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        computed:{
            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.empresas.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('empresas'));
            console.log(data);
            
            if(data) {
                this.empresas = data.empresas;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getEmpresas();
        },
        watch: {
            dialogCrear(){
                if(!this.dialogCrear){
                    if(this.creado){
                        this.total +=1;
                        this.empresas.unshift(this.bandera);
                        window.localStorage.setItem('empresas',JSON.stringify({empresas:this.empresas,total:this.total,offset:this.offset}));
                        this.creado = false;
                    }
                }
            },
            dialogBorrar(){
                if (!this.dialogBorrar) {
                    if(this.eliminado) {
                        this.total -=1;
                        this.empresas.filter((a,i) => a.id == this.bandera.id ? this.empresas.splice(i,1):null);
                        window.localStorage.setItem('empresas',JSON.stringify({empresas:this.empresas,total:this.total,offset:this.offset}));
                        this.eliminado = false;
                    }
                }
            },
            dialogEditar(){
                if(!this.dialogEditar){
                    if(this.editado){
                        this.empresas.filter((a,i) => a.id == this.bandera.id ? Object.assign(this.empresas[i],this.bandera):null);
                        window.localStorage.setItem('empresas',JSON.stringify({empresas:this.empresas,total:this.total,offset:this.offset}));
                        this.editado = false;
                    }
                }
            }
        },
        methods:{
            getEmpresas(){
                this.loading = true;
                Empresa().get(`/?offset=${this.offset}&order=desc`).then((response) => {
                    response.data.data.filter(a => a.fecha_registro = a.fecha_registro.substr(0,10));
                    response.data.data.filter(a => this.empresas.push(a));
                    this.total = response.data.totalCount;
                    this.offset += 50;
                    this.loading = false;
                    window.localStorage.setItem('empresas',JSON.stringify({empresas:this.empresas,total:this.total,offset:this.offset}));
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteItem(item){
                this.dialogBorrar = true;
                this.bandera = Object.assign({},item);
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

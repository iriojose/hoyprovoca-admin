<template>
    <div :class="$vuetify.breakpoint.smAndDown ? null:drawer ? 'left':null">
        <v-card width="100%" elevation="0">
            <v-card-title>
                <v-btn color="#2950c3" @click="dialogCrear = true" fab small>
                    <v-icon color="#fff" class="mx-2">mdi-plus-circle</v-icon>
                </v-btn>
                <v-btn color="#2950c3" @click="reload()" fab small class="mx-2">
                    <v-icon color="#fff" :loading="loading" class="mx-2">mdi-reload</v-icon>
                </v-btn>
                <v-spacer class="hidden-sm-and-up"></v-spacer>
                <v-btn 
                    color="#2950c3" tile 
                    class="mx-2 text-capitalize white--text rounded" 
                    :loading="loading" @click="getUsuarios()" :disabled="bloqueado"
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
                    :items="usuarios" 
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

        <!--modal para crear usuario -->
        <CrearUsuario :dialog="dialogCrear">
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
        </CrearUsuario>

        <!--modal para eliminar grupo -->
        <EliminarUsuario :dialog="dialogBorrar">
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
        </EliminarUsuario>

        <!-- modal para editar usuario -->
        <EditarUsuario :dialog="dialogEditar">
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
        </EditarUsuario>
    </div>
</template>

<script>
import Usuario from '@/services/Usuario';
import variables from '@/services/variables_globales';
import Puntos from '@/components/loaders/Puntos';
import CrearUsuario from '@/components/modals/CrearUsuario';
import EliminarUsuario from '@/components/modals/EliminarUsuario';
import EditarUsuario from '@/components/modals/EditarUsuario';
import {mapState} from 'vuex';

    export default {
        components: {
            Puntos,
            CrearUsuario,
            EliminarUsuario,
            EditarUsuario
        },
        data(){
            return {
                //variables del crud
                creado:false,
                eliminado:false,
                editado:false,
                bandera:{
                    imagen:"default.png"
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
                usuarios:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Apellido', value: 'apellido'},
                    { text: 'Email', value: 'email',align:'center'},
                    { text: 'Nivel de usuario', value: 'perfil',align:'center'},
                    { text: 'Estado', value: 'estado'},
                    { text: 'Cuenta', value: 'cuenta'},
                    { text: 'Fecha', value: 'usuario_in',align:'center'},
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        computed:{
            ...mapState(['drawer']),

            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.usuarios.length >= this.total) return true;
                else return false;
            }
        },
        head: {
            title() {
                return {
                    inner: "Admin",
                    separator:'|',
                    complement:'Usuarios'
                };
            }
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('usuarios'));

            if(data) {
                this.usuarios = data.usuarios;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getUsuarios(); 
        },
        watch: {
            dialogCrear(){
                if(!this.dialogCrear){
                    if(this.creado){
                        this.total +=1;
                        this.bandera.usuario_in = this.bandera.usuario_in.substr(0,10);
                        this.bandera.cuenta = "No verificada"; 
                        this.usuarios.unshift(this.bandera);
                        window.localStorage.setItem('usuarios',JSON.stringify({usuarios:this.usuarios,total:this.total,offset:this.offset}));
                        this.creado = false;
                    }
                }
            },
            dialogBorrar(){
                if (!this.dialogBorrar) {
                    if(this.eliminado) {
                        this.total -=1;
                        this.usuarios.filter((a,i) => a.id == this.bandera.id ? this.usuarios.splice(i,1):null);
                        window.localStorage.setItem('usuarios',JSON.stringify({usuarios:this.usuarios,total:this.total,offset:this.offset}));
                        this.eliminado = false;
                    }
                }
            },
            dialogEditar(){
                if(!this.dialogEditar){
                    if(this.editado){
                        this.usuarios.filter((a,i) => a.id == this.bandera.id ? Object.assign(this.usuarios[i],this.bandera):null);
                        window.localStorage.setItem('usuarios',JSON.stringify({usuarios:this.usuarios,total:this.total,offset:this.offset}));
                        this.editado = false;
                    }
                }
            }
        },
        methods:{
            reload(){
                this.usuarios=[];
                this.total = 0;
                this.offset = 0;
                this.getUsuarios();
            },
            getUsuarios(){
                this.loading = true;
                Usuario().get(`/?offset=${this.offset}&order=desc`).then((response) => {
                    for (let i = 0; i < response.data.data.length; i++) {
                        if(response.data.data[i].perfil_id == 1){
                            response.data.data[i].perfil = 'Administrador';
                        }else if(response.data.data[i].perfil_id == 2){
                            response.data.data[i].perfil = 'Super usuario';
                        }else if(response.data.data[i].perfil_id == 3){
                            response.data.data[i].perfil = 'Cliente';
                        }else if(response.data.data[i].perfil_id == 4){
                            response.data.data[i].perfil = 'Repartidor';
                        }
                        if(response.data.data[i].bloqueado == 0) response.data.data[i].estado = "Activo";
                        else response.data.data[i].estado = "Bloqueado";
                        if(response.data.data[i].verificado == 0) response.data.data[i].cuenta = "No verificada";
                        else response.data.data[i].cuenta = "Verificada";
                        response.data.data.filter(a => a.usuario_in !== null ? a.usuario_in = a.usuario_in.substr(0,10):a.usuario_in=" - ");
                        this.usuarios.push(response.data.data[i]);
                    }
                    this.total = response.data.totalCount;
                    this.offset+=50;
                    this.loading = false;
                    window.localStorage.setItem('usuarios',JSON.stringify({usuarios:this.usuarios,total:this.total,offset:this.offset}));
                }).catch(e => {
                    console.log(e);
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
    .left{
        margin-left:250px;
    }
</style>
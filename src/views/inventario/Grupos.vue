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

        <!--modal para borrar un grupo -->
        <v-dialog v-model="dialogBorrar" width="400" transition="dialog-bottom-transition">
            <v-card>
                <v-card-text>
                    <div v-if="!showMessage && !loadingBorrar" class="text-center title font-weight-black pt-10">
                        ¿Seguro que quiere eliminar este Grupo? 
                    </div>

                    <v-row justify="space-around" class="py-10" v-if="!showMessage && !loadingBorrar" >
                        <v-btn elevation="3" color="#232323" class="text-capitalize white--text" @click="getConcepto()">
                            Sí, seguro
                        </v-btn>

                        <v-btn elevation="3" color="#fff" class="text-capitalize" @click="close">
                            No, volver
                        </v-btn>
                    </v-row>

                    <v-scroll-x-transition>
                        <LoaderRect class="py-12" v-show="loadingBorrar" />
                    </v-scroll-x-transition>
                    
                    <v-scroll-x-transition>
                        <Message  v-show="showMessage" :mensaje="mensaje" :color="color" :icon="icon" />
                    </v-scroll-x-transition>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!--modal para crear un grupo -->

        <ModalCreateGrupo :dialog="dialogGrupo">
            <template v-slot:close>
                <v-btn fab small text @click="dialogGrupo = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </ModalCreateGrupo>
    </div>
</template>

<script>
import Grupos from '@/services/Grupos';
import Conceptos from '@/services/Conceptos';
import LoaderRect from '@/components/loaders/LoaderRect';
import variables from '@/services/variables_globales';
import Message from '@/components/mensajes/Message';
import ModalCreateGrupo from '@/components/dialogs/ModalCreateGrupo';
import router from '@/router';

    export default {
        components:{
            LoaderRect,
            Message,
            ModalCreateGrupo
        },
        data(){
            return {
                ...variables,
                loading:false,
                loadingBorrar:false,
                dialogGrupo:false,
                dialogBorrar:false,
                showMessage:false,
                eliminado:false,
                icon:'',
                color:'',
                mensaje:'',
                total:0,
                offset:0,
                search:'',
                bandera:null,
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
                if (!this.dialogBorrar) setTimeout(() => {this.showMessage = false},300);
            },
            dialogGrupo(){
                if (!this.dialogGrupo) this.mostRecent();
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
            respuesta(icon,mensaje,color){
                this.icon = icon;
                this.color = color;
                this.mensaje = mensaje;
                this.loadingBorrar = false;
                this.showMessage = true;
            },
            deleteItem(item){
                this.dialogBorrar = true;
                this.bandera = item;
            },
            editar(item){//envia a la ruta editar
                window.localStorage.setItem('editar',item.id);
                router.push('/grupos/grupo');
            },
            getConcepto(){//se determina si el grupo tiene conceptos indexados
                this.loadingBorrar = true;
                Conceptos().get(`/?limit=1&adm_grupos_id=${this.bandera.id}`).then((response) => {
                    if(response.data.data){
                        this.respuesta("mdi-alert-octagon","No se puede eliminar este grupo.","#D32F2F");
                    }else{
                        this.deleteGrupo();
                    }
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            deleteGrupo(){//elimina el grupo (solo si el grupo no tiene conceptos indexados)
                Grupos().delete(`/${this.bandera.id}`).then(() => {
                    const index = this.grupos.indexOf(this.bandera);
                    this.grupos.splice(index,1);
                    this.eliminado = true;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Grupo eliminado.","#388E3C");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            close(){//cierra el modal
                this.dialogBorrar = false;
                this.eliminado = false;
            },
            mostRecent(){//devuelve el ultimo grupo creado
                Grupos().get(`/?limit=1&order=desc`).then((response) => {
                    //solo lo agrega si es diferente al primero del array grupos
                    if(response.data.data[0].id !== this.grupos[0].id) this.grupos.unshift(response.data.data[0]);
                }).catch(e => {
                    console.log(e);
                });
            },
        }  
    }
</script>
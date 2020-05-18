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
                        <v-icon 
                            :small="$vuetify.breakpoint.smAndDown ? false:true"
                            class="mr-2" @click="editar(item)" 
                        >
                            mdi-border-color
                        </v-icon>
                        <v-icon 
                            :small="$vuetify.breakpoint.smAndDown ? false:true"
                            @click="deleteItem(item)"
                        >
                            mdi-delete
                            </v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <ModalCreateGrupo :dialog="dialogGrupo">
            <template v-slot:close>
                <v-btn fab small text @click="dialogGrupo = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
            <template v-slot:close2>
                <v-btn tile text @click="dialogGrupo = false" elevation="3" class="text-capitalize caption">
                    No, volver
                </v-btn>
            </template>
        </ModalCreateGrupo>

        <v-dialog v-model="dialogBorrar" width="400" transition="dialog-bottom-transition">
            <v-card>
                <v-card-text>
                    <div 
                        v-if="!showMessage && !loadingBorrar" 
                        class="text-center title font-weight-black pt-10"
                    >
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

                    <LoaderRect class="py-12" v-if="loadingBorrar" />

                    <div v-if="showMessage" class="py-12 text-center title font-weight-bold">
                        <div class="mb-3"><v-icon size="50" :color="color">{{icon}}</v-icon></div>
                        {{mensaje}}
                    </div>
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
import ModalCreateGrupo from '@/components/dialogs/ModalCreateGrupo';
import router from '@/router';

    export default {
        components:{
            LoaderRect,
            ModalCreateGrupo
        },
        data() {
            return {
                ...variables,
                bandera:null,//bandera del grupo a borrar
                total:0,//total de registros
                offset:0,//indica desde donde debe traer registros la llamada
                loading:false,
                loadingBorrar:false,
                dialogGrupo:false,//para abrir y cerrar el dialog de crear grupo
                dialogBorrar:false,//dialog para borrar item
                //variables el mensaje del dialog
                icon:'',
                color:'',
                mensaje:'',
                showMessage:false,//muestra el mensaje
                //variables de la tabla
                search:'',
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
            if(this.$route.name == 'grupos'){
                this.getGrupos();
            }
        },
        computed:{
            bloqueado(){
                if(this.grupos.length == this.total || this.loading ){
                    return true;
                }else{
                    return false;
                }
            }
        },
        watch: {
            dialogBorrar(){
                if(!this.dialogBorrar){
                    setTimeout(() => {this.showMessage = false},300);
                }
            },
            dialogGrupo(){
                if(!this.dialogGrupo){
                    this.grupos = [];
                    this.total = 0;
                    this.offset = 0;
                    this.getGrupos();
                }
            }
        },
        methods:{
            getGrupos(){
                this.loading=true;
                Grupos().get(`/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total = response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.loading=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
            deleteItem(item){
                this.dialogBorrar = true;
                this.bandera = item;
            },
            editar(item){
                window.localStorage.setItem('editar',item.id);
                router.push('/grupos/grupo');
            },
            getConcepto(){
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
            deleteGrupo(){
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
            respuesta(icon,mensaje,color){
                this.icon = icon;
                this.color = color;
                this.mensaje = mensaje;
                this.loadingBorrar = false;
                this.showMessage = true;
            },
            close(){
                this.dialogBorrar = false;
                this.eliminado = false;
            }
        }

    }
</script>

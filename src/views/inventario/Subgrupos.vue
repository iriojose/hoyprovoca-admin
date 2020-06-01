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
                    :loading="loading" @click="getSubgrupos()" :disabled="bloqueado"
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
                    :items="subgrupos" 
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
                        <v-icon :small="$vuetify.breakpoint.smAndDown ? false:true" class="mr-2">mdi-border-color</v-icon>
                        <v-icon :small="$vuetify.breakpoint.smAndDown ? false:true" @click="deleteItem(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!--modal para crear otro subgrupo -->
        <CrearSubgrupo :dialog="dialogCrear">
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
        </CrearSubgrupo>

        <!--modal para eliminar un subgrupo -->
        <EliminarSubgrupo :dialog="dialogBorrar">
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
        </EliminarSubgrupo>
    </div>
</template>

<script>
import SubGrupos from '@/services/SubGrupos';
import variables from '@/services/variables_globales';
import Puntos from '@/components/loaders/Puntos';
import CrearSubgrupo from '@/components/modals/CrearSubgrupo';
import EliminarSubgrupo from '@/components/modals/EliminarSubgrupo';

    export default {
        components: {
            Puntos,
            CrearSubgrupo,
            EliminarSubgrupo
        },
        data(){
            return {
                //variables del crud
                creado:false,
                eliminado:false,
                bandera:null,
                //variables de las tablas
                ...variables,
                total:0,
                offset:0,
                search:'',
                loading:false,
                dialogCrear:false,
                dialogBorrar:false,
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
        computed:{
            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.subgrupos.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('subgrupos'));

            if(data) {
                this.subgrupos = data.subgrupos;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getSubgrupos();
        },
        watch: {
            dialogCrear(){
                if(!this.dialogCrear){
                    if(this.creado){
                        this.total +=1;
                        this.subgrupos.unshift(this.bandera);
                        window.localStorage.setItem('subgrupos',JSON.stringify({subgrupos:this.subgrupos,total:this.total,offset:this.offset}));
                        this.creado = false;
                    }
                }
            },
            dialogBorrar(){
                if (!this.dialogBorrar) {
                    if(this.eliminado) {
                        this.total -=1;
                        this.subgrupos.filter((a,i) => a.id == this.bandera.id ? this.subgrupos.splice(i,1):null);
                        window.localStorage.setItem('subgrupos',JSON.stringify({subgrupos:this.subgrupos,total:this.total,offset:this.offset}));
                        this.eliminado = false;
                    }
                }
            },
        },
        methods:{
            getSubgrupos(){
                this.loading = true;
                SubGrupos().get(`/?offset=${this.offset}&order=desc`).then((response) => {
                    this.total = response.data.totalCount;
                    this.offset+=50;
                    response.data.data.filter(a => this.subgrupos.push(a));
                    this.loading = false;
                    window.localStorage.setItem('subgrupos',JSON.stringify({subgrupos:this.subgrupos,total:this.total,offset:this.offset}));
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteItem(item){
                this.dialogBorrar = true;
                this.bandera = Object.assign({},item);
            },
        }        
    }
</script>

<style lang="scss" scoped>
    .rounded{
        border-radius:5px;
    }
</style>
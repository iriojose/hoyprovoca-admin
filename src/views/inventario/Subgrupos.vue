<template>
    <div>
        <v-card width="100%" v-if="$route.name == 'subgrupos'">
            <v-toolbar flat color="#fff">
                <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="push">
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
                </v-btn>

                <v-btn 
                    @click="getSubgrupos()" 
                    dark 
                    class="mb-2 mx-2 text-capitalize caption" 
                    color="#005598"
                    :disabled="subgrupos.length == total || loading ? true:false"
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
                    hide-details
                    dense
                />
            </v-toolbar>
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
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="editar(item)">mdi-border-color</v-icon>
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
                                            @click="deleteSubgrupo()"
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
                            <div class="mb-3">
                                <v-icon size="50" color="#D32F2F">mdi-alert-octagon</v-icon>
                            </div>
                            No se puede eliminar este Subgrupo.
                        </div>

                        <div v-if="eliminado" class="py-12 text-center title font-weight-bold">
                            <div class="mb-3">
                                <v-icon size="50" color="#388E3C">mdi-checkbox-marked-circle-outline</v-icon>
                            </div>
                            Se elimino el Subgrupo exitosamente.
                        </div>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <router-view/>
    </div>
</template>

<script>
import SubGrupos from '@/services/SubGrupos';
import Conceptos from '@/services/Conceptos';
import variables from '@/services/variables_globales';
import LoaderRect from '@/components/loaders/LoaderRect';
import router from '@/router';

    export default {
        components:{
            LoaderRect
        },
        data() {
            return {
                //banderas
                ...variables,
                loading:true,
                loading2:false,
                dialog:false,
                eliminado:false,
                offset:0,
                //para validar
                search:'',
                total:0,
                valor:null,
                item:null,
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
        mounted() {
            this.getSubgrupos();
        },
        watch:{
            dialog(){
                setTimeout(()=> { 
                    if(!this.dialog){
                        this.valor=null;
                        this.eliminado=false;
                    } 
                },500);
            },
            "$route"(){
                if(this.$route.name == 'subgrupos'){
                    this.loading = true;
                    this.subgrupos = [];
                    this.offset = 0;
                    this.getSubgrupos();
                }
            }
        },
        methods:{
            push(){
                window.localStorage.removeItem('editar');
                router.push("/subgrupos/subgrupo");
            },
            getSubgrupos(){
                this.loading=true;
                SubGrupos().get(`/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total= response.data.totalCount;
                    response.data.data.filter(a => this.subgrupos.push(a));
                    this.loading=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteSubgrupo(){
                this.eliminado = false;
                this.loading2=true;
                SubGrupos().delete(`/${this.item.id}`).then(() => {
                    this.loading2=false;
                    this.eliminado = true;
                    const index = this.subgrupos.indexOf(this.item);
                    this.subgrupos.splice(index,1);
                }).catch(e => {
                    console.log(e);
                });
            },
            getConcepto(item){
                Conceptos().get(`/?limit=1&adm_subgrupos_id=${item.id}`).then((response) => {
                    this.valor = response.data.data;
                    this.loading2 = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteItem(item){
                this.item=item;
                this.dialog = true;
                this.loading2 = true;
                this.getConcepto(item);
            },
            editar(item){
                window.localStorage.setItem('editar',item.id);
                router.push('/subgrupos/subgrupo');
            }
        }
    }
</script>

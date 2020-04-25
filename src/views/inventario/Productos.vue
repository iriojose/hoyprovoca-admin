<template>
    <div>
        <v-card width="100%" v-if="$route.name == 'productos'">
            <v-toolbar flat color="#fff">
                <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="push">
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
                </v-btn>

                <v-btn 
                    @click="getConceptos()" 
                    dark 
                    class="mb-2 mx-2 text-capitalize caption" 
                    color="#005598"
                    :disabled="conceptos.length == total || loading ? true:false"
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
                :items="conceptos" 
                class="elevation-0" 
                :search="search"
            >   
                <template v-slot:item.imagen="{item}">
                    <v-avatar size="50">
                        <v-img :src="image+item.imagen"></v-img>
                    </v-avatar>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2">mdi-border-color</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <router-view/>
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';
import router from '@/router';
import variables from '@/services/variables_globales';
import accounting from 'accounting';
import {mapState} from 'vuex';

    export default {
        data(){
            return {
                ...variables,
                offset:0,
                search:'',
                eliminado:false,
                valor:null,
                total:0,
                item:null,
                dialog:false,
                loading2:false,
                loading:true,
                conceptos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Codigo', value: 'codigo'},
                    { text: 'Referencia', value: 'referencia'},
                    { text: 'Precio', value: 'precio_a'},
                    { text: 'Existencia', value: 'existencias[0].existencia'},
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        mounted() {
            this.getConceptos();
        },
        computed: {
            ...mapState(['user'])
        },
        watch:{
            dialog(){
                setTimeout(()=> { 
                    if(!this.dialog){
                        this.valor=null;
                        this.eliminado=false;
                    } 
                },500);
            }
        },
        methods: {
            push(){
                router.push("/productos/producto");
            },
            getConceptos(){
                this.loading=true;
                Empresa().get(`/${this.user.data.adm_empresa_id}/conceptos/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total= response.data.totalCount;
                    response.data.data.filter(a => a.precio_a = accounting.formatMoney(+a.precio_a,{symbol:"Bs ",thousand:'.',decimal:','}));
                    response.data.data.filter(a => this.conceptos.push(a));
                    this.loading=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteItem(item){
                this.item=item;
                this.dialog = true;
                this.loading2 = true;
                //this.getConcepto(item);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
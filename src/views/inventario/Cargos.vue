<template>
    <div>
        <v-card width="100%" v-if="$route.name == 'cargos'">
            <v-toolbar flat color="#fff">
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
                @click:row="select($event)"
            >   
                <template v-slot:item.imagen="{item}">
                    <v-avatar size="50">
                        <v-img :src="image+item.imagen"></v-img>
                    </v-avatar>
                </template>
                <template slot="loading">
                    <LoaderRect class="mb-12"/> 
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" width="700" transition="dialog-bottom-transition">
            <v-card>
                <v-card-text>
                    <v-btn color="#005598" dark class="my-2 text-capitalize caption" @click="push">
                        Nuevo
                        <v-icon dark class="ml-2">mdi-plus-box</v-icon>
                    </v-btn>
                    <v-data-table 
                        :loading="loading && '#005598'" 
                        loading-text="Loading... Please wait" 
                        :headers="headers2" 
                        :items="cargos" 
                        class="elevation-0" 
                    >   
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>

        <router-view/>
    </div>
</template>

<script>
import Cargos from '@/services/Cargos';
import {mapState} from 'vuex';
import Empresa from '@/services/Empresa';
import router from '@/router';
import variables from '@/services/variables_globales';
import accounting from 'accounting';
import LoaderRect from '@/components/loaders/LoaderRect';

    export default {
        components:{
            LoaderRect
        },
        data(){
            return {
                ...variables,
                offset:0,
                search:'',
                total:0,
                dialog:false,
                loading:false,
                conceptos:[],
                cargos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Codigo', value: 'codigo'},
                    { text: 'Referencia', value: 'referencia'},
                    { text: 'Precio', value: 'precio_a'},
                    { text: 'Existencia', value: 'existencias[0].existencia'},
                ],
                headers2: [
                    { text: 'Fecha', value: 'fecha_at'},
                    { text: 'Producto',sortable: true, value:'concepto'},
                    { text: 'Cantidad', value: 'cantidad'},
                    { text: 'Usuario', value: 'usuario'},
                ],
            }
        },
        mounted() {
            if(this.$route.name == 'cargos'){
                this.getConceptos();
            }
        },
        computed: {
            ...mapState(['user'])
        },
        watch: {
            "$route"(){
                if(this.$route.name == 'cargos'){
                    this.loading = true;
                    this.conceptos = [];
                    this.offset = 0;
                    this.getConceptos();
                }
            }
        },
        methods:{
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
            select(item){
                this.dialog = true;
                window.localStorage.setItem('editar',item.id);
                this.getCargos(item);
            },
            push(){
                this.dialog = false;
                router.push('/cargos/cargo');
            },
            getCargos(item){
                this.loading = true;
                Cargos().get(`/?adm_conceptos_id=${item.id}&limit=1000`).then((response) => {
                    console.log(response);
                    if(response.data !== 'This entity is empty'){
                        response.data.data.filter(a => a.usuario = this.user.data.nombre);
                        response.data.data.filter(a => a.concepto = item.nombre);
                        response.data.data.filter(a => a.fecha_at = a.fecha_at.substr(0,10));
                        this.cargos = response.data.data;
                    }else{
                        this.cargos = [];
                    }
                    this.loading = false;
                }).catch(e=> {
                    console.log(e);
                });
            },
        }
    }
</script>
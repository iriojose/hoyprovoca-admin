<template>
    <div>
        <v-card width="100%">
            <v-toolbar flat color="#fff">
                <v-btn 
                    @click="getCargos(user.data.adm_empresa_id)" 
                    dark 
                    class="mb-2 mx-2 text-capitalize caption" 
                    color="#005598"
                    :disabled="cargos.length == total || loading ? true:false"
                >
                    Ver más 
                    <v-icon dark class="ml-2">mdi-chevron-right-box</v-icon>
                </v-btn>
                <v-btn 
                    color="#005598" dark 
                    class="mb-2 text-capitalize caption" 
                    @click="dialogCargo = true"
                >
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
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
                :items="cargos" 
                class="elevation-0" 
                :search="search"
            >   
                <template slot="loading">
                    <LoaderRect class="mb-12"/> 
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';
import {mapState} from 'vuex';
import LoaderRect from '@/components/loaders/LoaderRect';

    export default {
        components:{
            LoaderRect,
        },
        data(){
            return {
                loading:false,
                dialogCargo:false,
                search:'',
                offset:0,
                total:0,
                cargos:[],
                headers: [
                    { text: 'Fecha', value: 'fecha_at',align:'center'},
                    { text: 'Producto',sortable: true, value:'concepto.nombre'},
                    { text: 'Cantidad', value: 'cantidad'},
                    { text: 'Usuario', value: 'usuario'},
                ],
            }
        },
        watch: {
            dialogCargo(){
                if (!this.dialogCargo) this.mostRecent(this.user.data.adm_empresa_id);
            }
        },
        computed:{
            ...mapState(['user'])
        },
        mounted() {
            this.getCargos(this.user.data.adm_empresa_id)
        },
        methods:{
            getCargos(id){
                this.loading = true;
                Empresa().get(`${id}/cargos/?limit=50&offset=${this.offset}&order=desc`).then((response) => {
                    if(response.data !== 'This entity is empty'){
                        response.data.data.filter(a => a.usuario = this.user.data.nombre + this.user.data.apellido);
                        response.data.data.filter(a => {
                            if(a.fecha_at) a.fecha_at = a.fecha_at.substr(0,10);
                            else a.fecha_at = '-';
                        });
                        response.data.data.filter(a => this.cargos.push(a));
                        this.offset+=50;
                        this.total= response.data.totalCount;
                    }else{
                        this.cargos = [];
                    }
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            mostRecent(id){
                Empresa().get(`${id}/cargos/?limit=1&order=desc`).then((response) => {
                    if(response.data.data[0].id !== this.cargos[0].id){
                        response.data.data[0].usuario = this.user.data.nombre + this.user.data.apellido;
                        response.data.data[0].fecha_at = response.data.data[0].fecha_at.substr(0,10);
                        this.cargos.unshift(response.data.data[0]);
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
        }  
    }
</script>

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
                    :loading="loading" @click="getCargos()" :disabled="bloqueado"
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
                    :items="cargos" 
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
                </v-data-table>
            </v-card-text>
        </v-card>

        <!--modal para crear cargo -->
        <CrearCargo :dialog="dialogCrear">
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
        </CrearCargo>
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';
import variables from '@/services/variables_globales';
import Puntos from '@/components/loaders/Puntos';
import {mapState} from 'vuex';
import CrearCargo from '@/components/modals/CrearCargo';

    export default {
        components: {
            Puntos,
            CrearCargo,
        },
        data(){
            return {
                //variables del crud
                creado:false,
                bandera:null,
                //variables de las tablas
                ...variables,
                total:0,
                offset:0,
                search:'',
                loading:false,
                dialogCrear:false,
                cargos:[],
                headers: [
                    { text: 'Fecha', value: 'fecha_at',align:'center'},
                    { text: 'Producto',sortable: true, value:'concepto.nombre'},
                    { text: 'Cantidad', value: 'cantidad'},
                    { text: 'Usuario', value: 'usuario'},
                ],
            }
        },
        head: {
            title() {
                return {
                    inner: "Admin",
                    separator:'|',
                    complement:'Cargos'
                };
            }
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('cargos'));

            if(data) {
                this.cargos = data.cargos;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getCargos(this.user.data.adm_empresa_id);
        },
        computed:{
            ...mapState(['user','drawer']),

            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.cargos.length >= this.total) return true;
                else return false;
            }
        },
        watch: {
            dialogCrear(){
                if(!this.dialogCrear){
                    if(this.creado){
                        this.total +=1;
                        this.cargos.unshift(this.bandera);
                        window.localStorage.setItem('cargos',JSON.stringify({cargos:this.cargos,total:this.total,offset:this.offset}));
                        this.creado = false;
                    }
                }
            },
        },
        methods:{
            reload(){
                this.cargos=[];
                this.total = 0;
                this.offset = 0;
                this.getCargos();
            },
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
                        window.localStorage.setItem('cargos',JSON.stringify({cargos:this.cargos,total:this.total,offset:this.offset}));
                    }else{
                        this.cargos = [];
                    }
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
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
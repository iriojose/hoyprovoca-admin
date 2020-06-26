<template>
    <div>
        <v-card  width="100%">
            <v-card-title>
                <v-btn 
                    color="#2950c3" tile @click="reload()"
                    class="text-capitalize white--text rounded"
                >
                    Reload
                    <v-icon color="#fff" class="mx-2">mdi-reload</v-icon>
                </v-btn>
                <v-spacer class="hidden-sm-and-up"></v-spacer>
                <v-btn 
                    color="#2950c3" tile 
                    class="mx-2 text-capitalize white--text rounded" 
                    :loading="loading" @click="getPagos()" :disabled="bloqueado"
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
                    :items="pagos" 
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
                        <v-icon 
                            :small="$vuetify.breakpoint.smAndDown ? false:true" 
                            @click="verPago(item)"
                        >mdi-eye</v-icon>
                        <v-icon 
                            v-if="item.estatus_id == 1"
                            class="mx-2" color="warning"
                            :small="$vuetify.breakpoint.smAndDown ? false:true"
                        >mdi-bell-ring</v-icon>
                        <v-icon 
                            v-if="item.estatus_id == 2"
                            class="mx-2" color="red"
                            :small="$vuetify.breakpoint.smAndDown ? false:true"
                        >mdi-block-helper</v-icon>
                        <v-icon 
                            v-if="item.estatus_id == 3"
                            class="mx-2" color="green"
                            :small="$vuetify.breakpoint.smAndDown ? false:true"
                        >mdi-check-bold</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import Pagos from '@/services/Pagos';
import variables from '@/services/variables_globales';
import Puntos from '@/components/loaders/Puntos';
import accounting from 'accounting';

    export default {
        components: {
            Puntos,
        },
        data(){
            return {
                bandera:null,
                //variables de las tablas
                ...variables,
                total:0,
                offset:0,
                search:'',
                loading:false,
                pagos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Emisor',sortable: true, value: 'emisor'},
                    { text: 'Receptor', value: 'receptor'},
                    { text: 'Monto', value: 'monto'},
                    { text: 'Referecia', value: 'codigo_referencia'},
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                prueba:{
                    imagen:"default.png",
                    emisor:"Cliente",
                    receptor:"somossistemas",
                    monto:"2000000",
                    codigo_referencia:"2821222121",
                    estatus_id:"3"
                }
            }
        },
        head: {
            title() {
                return {
                    inner: "Admin",
                    separator:'|',
                    complement:'Pagos'
                };
            }
        },
        computed:{
            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.pagos.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('pagos'));

            if(data) {
                this.pagos = data.pagos;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getPagos();
        },
        methods:{
            getPagos(){
                this.pagos.push(this.prueba);
                this.loading = true;
                Pagos().get(`/?offset=${this.offset}&order=desc`).then((response) => {
                    if(response.data.data){
                        this.total = response.data.totalCount;
                        this.offset+=50;
                        response.data.data.filter(a => a.precio_a = accounting.formatMoney(+a.monto,{symbol:"Bs ",thousand:'.',decimal:','}));
                        response.data.data.filter(a => this.pagos.push(a));
                        window.localStorage.setItem('pagos',JSON.stringify({pagos:this.pagos,total:this.total,offset:this.offset}));
                    }
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            reload(){
                this.total = 0;
                this.offset = 0;
                this.getPagos();
            },
            verPago(item){
                console.log(item);
            }
        }        
    }
</script>

<style lang="scss" scoped>
    .rounded{
        border-radius:5px;
    }
</style>
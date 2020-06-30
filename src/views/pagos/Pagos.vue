<template>
    <div>
        <v-card  width="100%">
            <v-card-title>
                <v-btn color="#2950c3" @click="reload()" fab small class="mx-2">
                    <v-icon color="#fff" :loading="loading" class="mx-2">mdi-reload</v-icon>
                </v-btn>
                <v-spacer class="hidden-sm-and-up"></v-spacer>
                <v-btn 
                    color="#2950c3" tile 
                    class="mx-2 text-capitalize white--text rounded" 
                    :loading="loading" @click="getPedidos()" :disabled="bloqueado"
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
                    :items="pedidos" 
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
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <!--modal para ver el pedido -->
        <ProcesarPedido :dialog="dialog" :pedido="bandera">
            <template v-slot:close>
                <v-btn tile color="#232323" text @click="dialog = false">
                    Salir
                </v-btn>
            </template>
            <template v-slot:salir>
                <v-btn fab small color="#fff" @click="dialog = false">
                    <v-icon color="#232323">mdi-close</v-icon>
                </v-btn>
            </template>
        </ProcesarPedido>
    </div>
</template>

<script>
import Pedidos from '@/services/Pedidos';
import variables from '@/services/variables_globales';
import Puntos from '@/components/loaders/Puntos';
import accounting from 'accounting';
import ProcesarPedido from '@/components/modals/ProcesarPedido';

    export default {
        components: {
            Puntos,
            ProcesarPedido
        },
        data(){
            return {
                bandera:null,
                dialog:false,
                //variables de las tablas
                ...variables,
                total:0,
                offset:0,
                search:'',
                loading:false,
                pedidos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'fecha',sortable: true, value: 'fecha_at'},
                    { text: 'Estado', value: 'estado'},
                    { text: 'Productos', value: 'items',align:'center'},
                    { text: 'Monto', value: 'monto'},
                    { text: 'Proceso', value: 'estatus'},
                    { text: 'Acciones', value: 'action', sortable: false ,align:'center'},
                ],
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
                if(this.pedidos.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            let data = JSON.parse(window.localStorage.getItem('pedidos'));

            if(data) {
                this.pedidos = data.pedidos;
                this.total = data.total;
                this.offset = data.offset;
            }else this.getPedidos();
        },
        methods:{
            getPedidos(){
                this.loading = true;
                Pedidos().get(`/?offset=${this.offset}&order=desc`).then((response) => {
                    if(response.data.data){
                        response.data.data.filter(a => a.fecha_at = a.fecha_at.substr(0,10));
                        response.data.data.filter(a => a.items = a.detalles.length);
                        for (let i = 0; i < response.data.data.length; i++) {
                           let suma = 0;
                           response.data.data[i].detalles.filter(a => suma+= a.precio);
                           response.data.data[i].monto = accounting.formatMoney(+suma,{symbol:"Bs ",thousand:'.',decimal:','});
                        }
                        for (let i = 0; i < response.data.data.length; i++) {
                           if(response.data.data[i].rest_estatus_id == 1) response.data.data[i].estatus = "Por pagar";
                           if(response.data.data[i].rest_estatus_id == 2) response.data.data[i].estatus = "Por verificar";
                           if(response.data.data[i].rest_estatus_id == 3) response.data.data[i].estatus = "Verificado";
                        }
                        response.data.data.filter(a => this.pedidos.push(a));
                    }
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            reload(){
                this.pedidos = [];
                this.total = 0;
                this.offset = 0;
                this.getPedidos();
            },
            verPago(item){
                this.bandera = Object.assign({},item);
                this.dialog = true;
            }
        }        
    }
</script>

<style lang="scss" scoped>
    .rounded{
        border-radius:5px;
    }
</style>
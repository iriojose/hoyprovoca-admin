<template>
    <v-container class="mt-3">
        <v-data-table 
            no-results-text="No se encontraron resultados..."
            :headers="headers"
            :items="pedidos"
            hide-default-footer
        >
        </v-data-table>
    </v-container>
</template>

<script>
import Usuario from '@/services/Usuario';

    export default {
        data() {
            return {    
                pedidos:[],
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Estado', value: 'estado' },
                    { text: 'Estatus', value: 'estatus' },
                    { text: 'Detalles', value: 'items' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        mounted(){
            this.getPedidosUsuario(this.usuario.id);
        },
        props:{
            usuario:{
                type:Array,
                default:() => ({})
            }
        },
        methods:{
            getPedidosUsuario(id){
                Usuario().get(`/${id}/pedidos`).then((response) => {
                    console.log(response);
                    this.pedidos = response.data.data;
                    this.processData();
                }).catch(e => {
                    console.log(e);
                });
            },
            processData(){
                this.pedidos.filter(a => a.rest_estatus.id !== 1 ? a.estatus='Por Facturar':a.estatus='Facturado');
            }
        }        
    }
</script>
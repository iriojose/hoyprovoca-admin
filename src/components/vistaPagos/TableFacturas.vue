<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-btn color="#005598" dark class="mb-2 text-capitalize caption" to="/nuevaFactura" >
                Nuevo
                <v-icon dark class="ml-2">
                    add_circle
                </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Buscar"
                single-line
                append-icon="search"
                type="text"
                color="#005598"
                hide-details
                dense
            />
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="facturas"
            class="elevation-0"
            :search="search"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">delete</v-icon>
                <v-icon small @click="pedidosEmpresa(item)">shop</v-icon>
            </template>
        </v-data-table>

        <v-dialog fullscreen v-model="dialog">
            <v-card>
                <v-card-title class="color">
                    <v-spacer></v-spacer>
                    Detalle Factura
                    <v-spacer></v-spacer>
                    <v-icon @click="dialog=!dialog">cancel</v-icon>
                </v-card-title>
                <v-divider></v-divider>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import Factura from '@/services/Factura';

    export default {
        data() {
            return {
                dialog:false,
                search:'',
                facturas:[
                    {
                        id:1,
                        fecha_in:'2020-02-19',
                        numero_factura:'0000256',
                        numero_fiscal:'02892466',
                        subtotal:200000+'bs.',
                    }
                ],
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Fecha',sortable: true, value: 'fecha_in' },
                    { text: 'Nro. Factura', value: 'numero_factura'},
                    { text: 'Nro. Fiscal', value: 'numero_fiscal'},
                    { text: 'Monto', value: 'subtotal'},
                    { text: 'Acciones', value: 'action', sortable: false},
                ],
            }
        },
        mounted() {
            //this.getFacturas();
        },
        methods: {
            getFacturas(){
                Factura().get("/").then((response) => {
                    this.facturas = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            }
        },
       
    }
</script>

<style scope>
    .color{
        background: #eee;
    }
</style>
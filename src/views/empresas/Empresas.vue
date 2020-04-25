<template>
    <div>
        <v-card width="100%" height="500">
            <v-toolbar flat color="#fff">
                <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="dialog=!dialog">
                    Nuevo
                    <v-icon dark class="ml-2">
                        mdi-plus-box
                    </v-icon>
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
                :headers="headers"
                :items="empresas"
                class="elevation-0"
                :search="search"
            >
                <template v-slot:item.logo="{item}">
                    <v-avatar size="50">
                        <v-img :src="image+item.logo"></v-img>
                    </v-avatar>
                </template>
            <!--template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">delete</v-icon>
                <v-icon small @click="pedidosEmpresa(item)">shop</v-icon>
            </template-->
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';
import variables from '@/services/variables_globales';

    export default {
        data() {
            return {
                ...variables,
                search:'',
                dialog:false,
                empresas:[],
                headers: [
                    { text: 'Imagen',align:'left',sortable: true,value:'logo',},
                    //{ text: 'Rif',sortable: true, value: 'rif' },
                    { text: 'Nombre', value: 'nombre_comercial' },
                    { text: 'Direccion', value: 'direccion' },
                    { text: 'Email', value: 'correo_electronico'},
                    { text: 'Telefono', value: 'telefono1' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        mounted(){
            this.getEmpresas();
        },
        methods: {
            getEmpresas(){
                Empresa().get("/").then((response) => {
                    console.log(response);
                    this.empresas = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
<template>
    <div>
        <v-card width="100%" v-if="$route.name == 'empresas'">
            <v-toolbar flat color="#fff">
                <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="push">
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
                </v-btn>

                <v-btn 
                    @click="getEmpresas()" 
                    dark 
                    class="mb-2 mx-2 text-capitalize caption" 
                    color="#005598"
                    :disabled="empresas.length == total || loading ? true:false"
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
                :items="empresas" 
                class="elevation-0" 
                :search="search"
            >   
                <template v-slot:item.logo="{item}">
                    <v-avatar size="50">
                        <v-img :src="image+item.logo"></v-img>
                    </v-avatar>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="editar(item)">mdi-border-color</v-icon>
                    <!--v-icon small class="mr-2">mdi-basket</v-icon>
                    <v-icon small class="mr-2">mdi-food</v-icon>
                    <v-icon small class="mr-2">mdi-cancel</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon-->
                </template>
            </v-data-table>
        </v-card>

        <router-view/>
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';
import variables from '@/services/variables_globales';
import router from '@/router';

    export default {
        data() {
            return {
                ...variables,
                offset:0,
                total:0,
                search:'',
                dialog:false,
                loading:true,
                empresas:[],
                headers: [
                    { text: 'Imagen',align:'left',sortable: true,value:'logo',},
                    { text: 'Rif',sortable: true, value: 'rif' },
                    { text: 'Nombre', value: 'nombre_comercial' },
                    { text: 'Direccion', value: 'direccion' },
                    { text: 'Registrada', value: 'fecha_registro'},
                    { text: 'Telefono', value: 'telefono1' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        mounted() {
            if(this.$route.name == 'empresas'){
                this.getEmpresas();
            }
        },
        watch: {
            "$route"(){
                if(this.$route.name == 'empresas'){
                    this.loading = true;
                    this.empresas = [];
                    this.offset = 0;
                    this.getEmpresas();
                }
            }
        },
        methods:{
            push(){
                window.localStorage.removeItem('editar');
                router.push("/empresas/empresa");
            },
            getEmpresas(){
                this.loading=true;
                Empresa().get(`/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total= response.data.totalCount;
                    response.data.data.filter(a => a.fecha_registro = a.fecha_registro.substr(0,10));
                    response.data.data.filter(a => this.empresas.push(a));
                    this.loading=false;
                    this.offset+=50;
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                });
            },
            editar(item){
                window.localStorage.setItem('editar',item.id);
                router.push('/empresas/empresa');
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
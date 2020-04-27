<template>
    <div>
        <v-card width="100%" v-if="$route.name == 'usuarios'">
            <v-toolbar flat color="#fff">
                <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="push">
                    Nuevo
                    <v-icon dark class="ml-2">mdi-plus-box</v-icon>
                </v-btn>

                <v-btn 
                    @click="getUsuarios()" 
                    dark 
                    class="mb-2 mx-2 text-capitalize caption" 
                    color="#005598"
                    :disabled="usuarios.length == total || loading ? true:false"
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
                :items="usuarios" 
                class="elevation-0" 
                :search="search"
            >   
                <template v-slot:item.fotografia="{item}">
                    <v-avatar size="50">
                        <v-img :src="image+item.fotografia"></v-img>
                    </v-avatar>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="editar(item)">mdi-border-color</v-icon>
                    <v-icon small class="mr-2" @click="pedidos(item)">mdi-basket</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <router-view/>
    </div>
</template>

<script>
import Usuario from '@/services/Usuario';
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
                usuarios:[],
                headers: [
                    { text: 'Imagen',align:'left',sortable: true,value:'fotografia'},
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Apellido', value: 'apellido' },
                    { text: 'usuario', value: 'login'},
                    { text: 'Email', value: 'email' },
                    { text: 'Perfil', value: 'perfil' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },      
        mounted(){
            if(this.$route.name == 'usuarios'){
                this.getUsuarios();
            }
        },
        watch: {
            "$route"(){
                if(this.$route.name == 'usuarios'){
                    this.loading = true;
                    this.usuarios = [];
                    this.offset = 0;
                    this.getUsuarios();
                }
            }
        },
        methods:{
            push(){
                window.localStorage.removeItem('editar');
                router.push("/usuarios/usuario");
            },
            getUsuarios(){
                this.loading=true;
                Usuario().get(`/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total= response.data.totalCount;
                    for (let i = 0; i < response.data.data.length; i++) {
                        if(response.data.data[i].perfil_id == 1){
                            response.data.data[i].perfil = 'Administrador';
                        }else if(response.data.data[i].perfil_id == 2){
                            response.data.data[i].perfil = 'Super usuario';
                        }else if(response.data.data[i].perfil_id == 3){
                            response.data.data[i].perfil = 'Cliente';
                        }else if(response.data.data[i].perfil_id == 0){
                            response.data.data[i].perfil = 'Bloqueado';
                        }
                        this.usuarios.push(response.data.data[i]);
                    }
                    this.loading=false;
                    this.offset+=50;
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                });
            },
            editar(item){
                window.localStorage.setItem('editar',item.id);
                router.push('/usuarios/usuario');
            },
            pedidos(item){
                window.localStorage.setItem('editar',item.id);
                router.push('/usuarios/pedidos');
            }
        }
    }
</script>

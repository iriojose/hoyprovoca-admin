<template>
    <v-app-bar
        app
        dark
        color="#005598"
    >
        <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click="change"></v-app-bar-nav-icon>

        <v-toolbar-title class="ml-10" v-if="!$vuetify.breakpoint.smAndDown">
            Administrador
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu offset-y open-on-hover v-if="usuario !== null">
            <template v-slot:activator="{ on }">
                <v-btn text depressed class="white--text caption" v-on="on">
                    <div>{{usuario.nombre}}</div>
                    <v-icon dark class="mx-2">
                        arrow_right
                    </v-icon>
                </v-btn>
            </template>
            <v-list dense>
                <v-list-item @click="log">
                    <v-list-item-content>Logout</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import router from '@/router';
import Usuario from '@/services/Usuario';

    export default {
        data() {
            return {
                usuario:null
            }
        },
        mounted() {
            if(this.user.token !== null){
                this.getUsuario();
            }
            console.log(this.user);
        },
        methods: {
            ...mapActions(['setBarraLateral','logout','setDataUsuario']),

            log(){
                this.logout();
                router.push("/login");
            },
            change(){
                if(this.barraLateral){
                    this.setBarraLateral(false);
                }else{
                    this.setBarraLateral(true);
                }
            },
            getUsuario(){
                Usuario().post("/validate",{user_token:this.user.token}).then((response) => {
                    this.usuario = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            }
        },
        computed: {
            ...mapState(['barraLateral','user']),
        },
    }
</script>
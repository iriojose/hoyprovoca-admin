<template>
    <v-app-bar app dark color="#005598">
        <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click="change"></v-app-bar-nav-icon>

        <v-btn @click="back" icon v-if="validacion()">
            <v-icon>
                arrow_back_ios
            </v-icon>
        </v-btn>

        <v-toolbar-title class="ml-10" v-if="!$vuetify.breakpoint.smAndDown">
            Administrador
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu offset-y open-on-hover v-if="usuario !== null">
            <template v-slot:activator="{ on }">
                <v-avatar size="35" v-on="on" :class="on ? 'elevation-4':null">
                    <v-img :src="ruta+usuario.fotografia"></v-img>
                </v-avatar>
            </template>
            <v-slide-y-transition>
                <v-list dense class="mt-2">
                    <v-list-item class="caption">
                        <v-list-item-content>Notificaciones</v-list-item-content>
                        <v-list-item-icon><v-icon>notifications</v-icon></v-list-item-icon>
                    </v-list-item>
                    <v-list-item class="caption">
                        <v-list-item-content>Perfil</v-list-item-content>
                        <v-list-item-icon><v-icon>person_pin</v-icon></v-list-item-icon>
                    </v-list-item>
                    <v-list-item @click="log" class="caption">
                        <v-list-item-content>Logout</v-list-item-content>
                        <v-list-item-icon><v-icon>power_settings_new</v-icon></v-list-item-icon>
                    </v-list-item>
                </v-list>
            </v-slide-y-transition>
        </v-menu>
    </v-app-bar>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import router from '@/router';
import Auth from '@/services/Auth';
import url from '@/services/ruta';

    export default {
        data() {
            return {
                usuario:null,
                ruta:null
            }
        },
        mounted() {
            this.ruta = url;
            if(this.user.token !== null){
                this.getUsuario();
            }else{
                this.log();
            }
        },
        methods: {
            ...mapActions(['setBarraLateral','logout','setDataUsuario']),
            back(){
                router.go(-1);
            },
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
                Auth().post("/sesion",{token:this.user.token}).then((response) => {
                    this.usuario = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            validacion(){
                if(this.$route.path == '/dashboard'){
                    return false;
                }else if(this.$route.path == '/pagos'){
                    return false;
                }else if(this.$route.path == '/Inventario'){
                    return false;
                }else if(this.$route.path == '/clientes'){
                    return false;
                }else if(this.$route.path == '/empresas'){
                    return false;
                }else if(this.$route.path == '/pedidos'){
                    return false;
                }else if(this.$route.path == '/estadisticas'){
                    return false;
                }else{
                    return true;
                }
            }
        },
        computed: {
            ...mapState(['barraLateral','user']),
        },
    }
</script>
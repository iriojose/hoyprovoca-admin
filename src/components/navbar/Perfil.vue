<template>
    <div>
        <v-menu
            :transition="transition()"
            bottom
            open-on-hover 
            offset-y
        >
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" fab :class="$vuetify.breakpoint.smAndDown ? 'mx-1':'mx-3'" small elevation="2">
                    <v-icon>
                        mdi-account
                    </v-icon>
                </v-btn>
            </template>
            <!-- lista de opciones-->
            <v-card class="customized">
                <v-list width="250" elevation="0">
                    <v-list-item class="border">
                        <v-list-item-avatar>
                            <v-img :src="image+user.data.fotografia"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title v-text="user.data.nombre+' '+user.data.apellido"></v-list-item-title>
                            <v-list-item-subtitle v-if="user.data.perfil_id==2">Super usuario</v-list-item-subtitle>
                            <v-list-item-subtitle v-if="user.data.perfil_id==1">Administrador</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list dense>
                    <v-hover v-slot:default="{hover}">
                        <v-list-item to="/account/profile">   
                            <v-list-item-icon>
                                <v-icon :color="hover ? '#232323':null">mdi-cogs</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                Ajustes
                            </v-list-item-title>        
                        </v-list-item>
                    </v-hover>
                    <v-hover v-slot:default="{hover}">
                        <v-list-item @click="logOut()">   
                            <v-list-item-icon>
                                <v-icon :color="hover ? '#232323':null">mdi-exit-to-app</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                Cerrar sesión
                            </v-list-item-title>        
                        </v-list-item>
                    </v-hover>
                </v-list>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
import {mapActions,mapState} from 'vuex';
import variables from '@/services/variables_globales';
import router from '@/router';

    export default {
        data() {
            return {
                ...variables
            }
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            ...mapActions(['logout']),
            transition(){
                return "slide-y-transition"
            },
            logOut(){
                this.logout();
                router.push('/login');
            },
        },
    }
</script>

<style lang="scss" scoped>
    .customized {
        margin-top: 10px;
    }
    .customized {
        border: 1px solid #d5cec8;
        display: block;
        background: white;
    }
    .customized:before,
    .customized:after {
        content: " ";
        height: 0;
        position: absolute;
        width: 0;
        border: 11px solid transparent;
        /* arrow size */
        right: 1%;
        transform: translateX(-100%);
    }
    .customized:before {
        border-bottom: 12px solid rgba(0, 0, 0, 0.1);
        border-right: 12px solid rgba(0, 0, 0, 0);
        border-top: 12px solid rgba(0, 0, 0, 0);
        content: "";
        display: inline-block;
        position: absolute;
        top: -24px;
    }
    .customized:after {
        border-bottom: 12px solid #fff;
        border-right: 12px solid rgba(0, 0, 0, 0);
        border-top: 12px solid rgba(0, 0, 0, 0);
        content: "";
        display: inline-block;
        position: absolute;
        top: -22px;
    }
</style>
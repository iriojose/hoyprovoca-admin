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

        <v-menu offset-y open-on-hover>
            <template v-slot:activator="{ on }">
                <v-btn text depressed class="white--text caption" v-on="on">
                    jose
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

    export default {
        methods: {
            ...mapActions(['setBarraLateral','logout']),

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
            }
        },
        computed: {
            ...mapState(['barraLateral','user']),
        },
    }
</script>
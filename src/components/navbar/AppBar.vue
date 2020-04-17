<template>
    <div>
        <BarraLateral />

        <v-app-bar app color="#f7f7f7" elevation="0">
            <v-btn fab class="mx-3" small elevation="2" @click="change">
                <v-icon v-if="drawer">
                    mdi-dots-vertical
                </v-icon>
                <v-icon v-else>
                    mdi-view-dashboard
                </v-icon>
            </v-btn>

            <v-toolbar-title class="cursor">
                <v-img 
                    contain 
                    height="60"
                    width="120"  
                    :src="require('@/assets/logo 3.png')"
                />
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-badge color="#005598" dot class="mx-3" bordered overlap>
                <v-icon>
                    mdi-bell
                </v-icon>
            </v-badge>

            <Perfil />
        </v-app-bar>
    </div>
</template>

<script>
import Perfil from './Perfil';
import BarraLateral from './BarraLateral';
import {mapState,mapActions} from 'vuex';

    export default {
        components:{
            Perfil,
            BarraLateral
        },
        computed: {
            ...mapState(['drawer'])
        },
        methods:{
            ...mapActions(['setDrawer']),

            change(){
                this.drawer ? this.setDrawer(false):this.setDrawer(true);
            },
        }
    }
</script>

<style lang="css" scoped>
    .cursor{
        cursor:pointer;
    }
</style>
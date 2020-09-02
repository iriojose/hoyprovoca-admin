<template>
    <div>
        <BarraLateral />

        <v-app-bar color="#232323" elevation="0" :class="$vuetify.breakpoint.smAndDown || !drawer ? '':'margen'">
            <v-btn fab class="mx-3" small elevation="2" @click="change">
                <v-icon v-if="drawer">
                    mdi-dots-vertical
                </v-icon>
                <v-icon v-else>
                    mdi-view-dashboard
                </v-icon>
            </v-btn>

            <div class="text-capitalize font-weight-bold white--text"> {{$route.name}} </div>
            
            <v-spacer></v-spacer>

            <v-btn text fab to="/notificaciones" small>
                <v-badge color="#232323" dot class="mx-3" bordered overlap>
                    <v-icon color="#fff">
                        mdi-bell
                    </v-icon>
                </v-badge>
            </v-btn>

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
    .sombra{
        /*box-shadow: 0px 0px 35px 80px (173, 185, 201, 0.8) !important;*/
        box-shadow: 0px 0px 35px 5px rgba(173, 185, 201,0.2);
    }
    .margen{
        margin-left:230px;
    }
    .color{
        color:#1f3b63;
    }
</style>
<template>
    <v-app style="background-color:#f7f7f7;">
        <AppBar v-if="ruta()" id="top" />
        <transition name="fade">
            <router-view/>
        </transition>  
        
        <ModalBloqueado />

        <!--v-hover v-slot:default="{hover}">
            <v-btn 
                @click="$vuetify.goTo('#top')" 
                tile dark bottom small
                right color="rgba(0,0,0,0.1)"
                class="v-btn--example btn" 
            >
                <v-icon :color="hover ? '#3b61d1':'#232323'">mdi-apple-keyboard-control</v-icon>
            </v-btn>
        </v-hover-->
    </v-app>
</template>

<script>
import AppBar from '@/components/navbar/AppBar';
import ModalBloqueado from '@/components/dialogs/ModalBloqueado';

    export default {
        name: 'App',
        components:{
            AppBar,
            ModalBloqueado
        },
        methods:{
            ruta(){
                if(
                    this.$route.name == 'login' || 
                    this.$route.name == 'forgot' ||
                    this.$route.name == 'notauthorized' ||
                    this.$route.name == 'notfound'
                ){
                    return false;
                }else{
                    return true;
                }
            }
        }
    }
</script>

<style lang="scss" scope>
    .v-btn--example {
        bottom: 0;
        right:0;
        position: fixed;
        margin: 16px;
        animation: animat 0.5s 1;
        //transform:translateX(-15px) rotate(10deg);
    }
    @keyframes animat{
        0% {
            transform: translateX(100px);
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    ::-webkit-scrollbar {
        width: 8px;     
        height: 8px;   
    }
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 12px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #b3b3b3;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    }
    ::-webkit-scrollbar-thumb:active {
        background-color: #999999;
    }
    ::-webkit-scrollbar-track {
        background: #fff;
        border-radius: 12px;
    }
    ::-webkit-scrollbar-track:hover,
    ::-webkit-scrollbar-track:active {
        background: #fff;
    }
</style>
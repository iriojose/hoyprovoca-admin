<template>
    <v-app style="background-color:#f7f7f7;">
        <AppBar v-if="ruta()" />
        <transition name="fade">
            <router-view/>
        </transition>  
    </v-app>
</template>

<script>
import AppBar from '@/components/navbar/AppBar';

    export default {
        name: 'App',
        components:{
            AppBar
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

<style>
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
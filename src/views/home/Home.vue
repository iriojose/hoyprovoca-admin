<template>
    <div>
        <AppBar />
        <BarraLateral />

        <v-container>
            <router-view/>
        </v-container>
    </div>
</template>

<script>
import AppBar from '@/components/navbar/AppBar';
import BarraLateral from '@/components/navbar/BarraLateral';
import Conceptos from '@/services/Conceptos';

    export default {
        components:{
            AppBar,
            BarraLateral
        },
        mounted() {
            this.getEmpresas();
        },
        methods: {
            getEmpresas(){
                Conceptos().get("/").then((response) => {
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                })
            }
        },
    }
</script>


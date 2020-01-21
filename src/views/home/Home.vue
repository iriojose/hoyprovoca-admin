<template>
    <div>
        <AppBar />
        <BarraLateral />

        <v-content class="mr-4">
            <router-view/>
        </v-content>
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


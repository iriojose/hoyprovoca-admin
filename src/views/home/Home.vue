<template>
    <div>
        <AppBar />
        <BarraLateral />
    </div>
</template>

<script>
import AppBar from '@/components/navbar/AppBar';
import BarraLateral from '@/components/navbar/BarraLateral';
import Empresa from '@/services/Empresa';

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
                Empresa().get("/").then((response) => {
                    console.log(response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            }
        },
    }
</script>


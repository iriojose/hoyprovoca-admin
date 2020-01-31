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
import router from '@/router';

    export default {
        components:{
            AppBar,
            BarraLateral
        },
        mounted() {
            router.push("/dashboard");
        },
    }
</script>


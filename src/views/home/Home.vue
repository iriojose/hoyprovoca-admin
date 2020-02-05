<template>
    <div>
        <AppBar />
        <BarraLateral />
        
        <v-container>
            <router-view/>
        </v-container>
        <Footer />
    </div>
</template>

<script>
import AppBar from '@/components/navbar/AppBar';
import Footer from '@/components/footer/Footer';
import BarraLateral from '@/components/navbar/BarraLateral';
import router from '@/router';

    export default {
        components:{
            AppBar,
            BarraLateral,
            Footer
        },
        mounted() {
            router.push("/dashboard");
        },
    }
</script>


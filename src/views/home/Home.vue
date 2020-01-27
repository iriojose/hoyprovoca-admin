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

    export default {
        components:{
            AppBar,
            BarraLateral
        },
    }
</script>


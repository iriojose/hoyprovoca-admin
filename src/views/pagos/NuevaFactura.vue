<template>
    <div>
        <AppBar />
        <CrearFactura />
        <Footer />
    </div>
</template>

<script>
import AppBar from '@/components/navbar/AppBar';
import CrearFactura from '@/components/vistaPagos/CrearFactura';
import Footer from '@/components/footer/Footer';

    export default {
        components:{
            AppBar,
            Footer,
            CrearFactura
        }        
    }
</script>

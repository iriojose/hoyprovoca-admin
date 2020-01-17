<template>
    <div>
        <v-row justify="center" align="center" class="fill-height mt-12">
            <v-col cols="12" md="4" sm="10">
                <FormLogin />
            </v-col>
        </v-row>

        <Footer />
    </div>
</template>

<script>
import FormLogin from '@/components/auth/FormLogin';
import Footer from '@/components/footer/Footer';

    export default {
        components:{
            FormLogin,
            Footer
        }        
    }
</script>
<template>
    <div>
        <v-row justify="center" align="center" class="fill-height mt-12">
            <v-img contain width="80" height="80" :src="require('@/assets/log2.png')"></v-img>
        </v-row>

        <v-row justify="center" align="center" :class="$vuetify.breakpoint.smAndDown ? 'fill-height mx-5':'fill-height'" >
            <v-col cols="12" md="4" lg="4" class="hidden-sm-and-down">
                <v-img contain class="fix" :src="require('@/assets/data.svg')"></v-img>
            </v-col>
            
            <v-col cols="12" md="3" sm="10"> 
                <v-card width="100%" height="450" elevation="5" class="py-5">
                    <div class="text-center my-5 font-weight-black subtitle-1">Iniciar sesión en Aftim</div>
                    <v-card-text>
                        <FormLogin />
                    </v-card-text>
                    <div class="mx-10 my-5">
                        <v-divider></v-divider>
                    </div>
                    <v-hover v-slot:default="{hover}">
                        <div :class="hover ? 'mx-2 subtitle-2 text-color decoracion text-center':'mx-2 subtitle-2 text-color text-center'">No puede iniciar sesión?</div>
                    </v-hover>
                </v-card>

                <div class="text-center my-3">
                    <v-hover v-slot:default="{hover}">
                        <span :class="hover ? 'mx-2 caption decoracion text-color font-weight-medium':'font-weight-medium mx-2 caption text-color'">Politicas de privacidad</span>
                    </v-hover>
                    ·
                    <v-hover v-slot:default="{hover}">
                        <span :class="hover ? 'mx-2 caption decoracion text-color font-weight-medium':' font-weight-medium mx-2 caption text-color'">condiciones del servicio</span>
                    </v-hover>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="hidden-sm-and-down"></v-col>
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

<style scope>
    .text-color{
        color: #005598;
    }
    .decoracion{
        text-decoration: underline;
        text-decoration-color: #005598;
        transition-delay: 2s;
        transition-duration: 1s;
    }
    .fix{
        position: fixed;
        left: 0px;
        bottom: 0px;
    }
</style>
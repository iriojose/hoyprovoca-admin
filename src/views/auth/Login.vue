<template>
    <div>
        <v-row justify="center" align="center" class="fill-height mt-12 px-5">
            <v-col cols="12" md="4" sm="8">
                <v-card height="400" width="100%" elevation="15">
                    <v-card-title>
                        titulo
                    </v-card-title>

                    <v-container>
                        <v-card-text>
                            <FormLogin />
                        </v-card-text>
                    </v-container>
                </v-card>
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
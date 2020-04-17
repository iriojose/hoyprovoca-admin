<template>
    <div>
        <v-row justify="center" align="center" class="mt-8 mb-5">
            <v-img contain width="100" height="50" :src="require('@/assets/logo2.png')"></v-img>
        </v-row>

        <v-row justify="center" align="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-5':null">
            <v-col cols="12" md="4" lg="4" class="hidden-sm-and-down">
                <v-img contain width="100%" height="300" :src="require('@/assets/dashboard.svg')"></v-img>
            </v-col>

            <v-col cols="12" md="4" sm="10" class="mt-5">
                <v-card width="100%" height="400" elevation="5" class="py-5">
                    <div class="text-center my-5 font-weight-black subtitle-1">Iniciar sesión</div>
                    
                    <v-card-text>
                        <FormLogin />
                    </v-card-text>

                    <div class="my-5">
                        <v-divider></v-divider>
                    </div>

                    <div @click="push()" class="text-center" >
                        <a class="mx-2 subtitle-2 underline text-color">
                            ¿No puede iniciar sesión?
                        </a>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" md="4" lg="4" class="hidden-sm-and-down">
                <v-img contain width="100%" height="300" :src="require('@/assets/charts.svg')"></v-img>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import FormLogin from '@/components/auths/FormLogin';
import router from '@/router';

    export default {
        components:{
            FormLogin
        },
        head:{
            title(){
                return {
                    inner:'Iniciar sesión',
                    separator:' ',
                    complement: ' '
                }
            }
        },
        methods: {
            push(){ router.push('/forgot') },
        },
    }
</script>

<style lang="scss" scoped>
    .text-color{
        color: #232323;
    }
    $thetransition: all .5s cubic-bezier(1,.25,0,.75) 0s;
    .underline{
        text-decoration: none;
        position: relative;
        &:before {
            content: "";
            position: absolute;
            width: 100%;
            height: 1px;
            bottom: 0;
            left: 0;
            background-color: #232323;
            visibility: hidden;
            -webkit-transform: scaleX(0);
            transform: scaleX(0);
            -webkit-transition: $thetransition;
            transition: $thetransition;
        }
        &:hover:before {
            visibility: visible;
            -webkit-transform: scaleX(1);
            transform: scaleX(1);
        }
    }
</style>
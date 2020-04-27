<template>
    <v-dialog v-model="block" close-delay width="500" transition="dialog-bottom-transition">
        <v-card height="500" class="pa-5">
            <v-card-text>
                <div class="text-center title font-weight-black">Usuario bloqueado</div>
                <div class="text-center subtitle-2 grey--text font-weight-black my-5">
                    Este usuario se encuentra bloqueado. Vuelva a intentarlo más tarde,
                    Restringimos determinado contenido y ciertas acciones para proteger 
                    a nuestra comunidad. Avisanos al correo de 
                    <span class="black--text subtitle-2 font-weight-black">somossistemas@gmail.com</span>
                    si hemos cometido un error.
                </div>
                <v-img contain width="100%" height="250" :src="require('@/assets/block.svg')"></v-img>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapState,mapActions} from 'vuex';
    export default {    
        computed:{
            ...mapState(['bloqueado']),
            block:{
                get(){ return this.bloqueado },
                set(val){ this.setModalBloqueado(val)},
            }
        },
        methods: {
            ...mapActions(['setModalBloqueado']),
            close(){
                this.setModalBloqueado(false);
            }
        },
    }
</script>
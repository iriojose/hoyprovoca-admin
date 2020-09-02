<template>
    <div :class="$vuetify.breakpoint.smAndDown ? null:drawer ? 'left':null">
        <v-card width="100%" height="500" class="pa-5" elevation="0">
            <v-card-text>
                <div class="font-weight-black text-center subtitle-1 mb-5">Centro de notificaciones</div>
            
                <v-row justify="center" align="center">
                    <div class="text-center font-weight-bold body-2">No hay notificaciones nuevas...</div>
                    <v-img contain width="100%" height="300" :src="require('@/assets/notifications.svg')" />
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import {mapState} from 'vuex';

    export default {
        computed:{
            ...mapState(['drawer'])
        }        
    }
</script>

<style lang="scss" scoped>
    .left{
        margin-left:250px;
    }
</style>
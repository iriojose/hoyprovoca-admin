<template>
    <div>
        <v-card width="100%" height="500" class="pa-5">
            <div class="font-weight-black subtitle-1 mb-5">Centro de notificaciones</div>
            
            <v-row justify="center" align="center">
                <div class="text-center font-weight-bold body-2">No hay notificaciones nuevas...</div>
                <v-img contain width="100%" height="300" :src="require('@/assets/notifications.svg')" />
            </v-row>
        </v-card>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>
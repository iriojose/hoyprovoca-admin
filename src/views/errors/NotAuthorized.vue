<template>
    <div> 
        <v-row justify="center" align="center" class="color">
            <v-col cols="12" md="6" sm="12">
                <v-img contain width="100%" height="500"  :src="require('@/assets/4032.svg')" />
            </v-col>
        </v-row>
        <v-row justify="center" align="center">
            <v-col cols="12" md="6" sm="12">
                <div class="display-2 font-weight-bold text-center"> 403 | Not authorized</div>
            </v-col>
        </v-row>
    </div>
</template>

<style lang="css" scoped>
    .color{
        background: #fff !important;
    }
</style>
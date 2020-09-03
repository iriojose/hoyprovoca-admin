<template>
    <div v-if="$vuetify.breakpoint.smAndDown">
        <div class="margen2"></div>
        <v-bottom-navigation color="#0D47A1" fixed>
            <v-btn to="/login" class="black--text text-capitalize">
                <span>Iniciar sesíon</span>
                <v-icon color="#0D47A1">mdi-exit-to-app</v-icon>
            </v-btn>
            <v-btn to="/" class="black--text text-capitalize">
                <span>Home</span>
                <v-icon color="#0D47A1">mdi-home</v-icon>
            </v-btn>
            <v-btn to="/register" class="black--text text-capitalize">
                <span>Registrate</span>
                <v-icon color="#0D47A1">mdi-text-box-minus</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
</template>

<style lang="scss" scoped>
    .margen2{
        margin-top:60px;
    }
</style>
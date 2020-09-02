<template>
    <div>
        <div v-if="$vuetify.breakpoint.smAndDown" class="margen"></div>
        <v-bottom-navigation color="#232323" fixed v-if="$vuetify.breakpoint.smAndDown">
            <v-btn to="/dashboard">
                <span>Dashboard</span>
                <v-icon color="#232323">mdi-view-dashboard</v-icon>
            </v-btn>
            <v-btn to="/profile">
                <span>Perfil</span>
                <v-icon color="#232323">mdi-account</v-icon>
            </v-btn>
            <v-btn to="/ayuda">
                <span>Soporte</span>
                <v-icon color="#232323">mdi-chat-processing</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
</template>

<style lang="scss" scope>
    .margen{
        margin-bottom:100px;
    }
</style> 
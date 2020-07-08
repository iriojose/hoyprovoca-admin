<template>
    <v-card elevation="0">
        <v-card-text>
            <v-row justify="center">
                <v-avatar size="100">
                    <v-img :src="image+usuario.imagen"></v-img>
                </v-avatar>
            </v-row>
            <v-list flat dense>
                <v-list-item>
                    <v-list-item-title class="body-1 font-weight-bold">
                        Nombre: {{usuario.nombre+' '+usuario.apellido}}
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="body-1 font-weight-bold">
                        {{usuario.email}}
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-cellphone</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="body-1 font-weight-bold">
                        {{usuario.telefono}}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
import variables from '@/services/variables_globales';

    export default {
        props:{
            usuario:{
                type:Object,
                default:() => ({
                    imagen:'default.png'
                })
            }
        },
        data() {
            return {
                ...variables
            }
        },
    }
</script>

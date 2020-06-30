<template>
    <v-list flat dense>
        <v-list-item>
            <v-list-item-avatar size="50">
                <v-img :src="image+usuario.imagen"></v-img>
            </v-list-item-avatar>
            <v-list-item-title>
                {{usuario.nombre+' '+usuario.apellido}}
            </v-list-item-title>
        </v-list-item>
        <v-list-item>
            <v-list-item-icon>
                <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                {{usuario.email}}
            </v-list-item-title>
        </v-list-item>
        <v-list-item>
            <v-list-item-icon>
                <v-icon>mdi-cellphone</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                {{usuario.telefono}}
            </v-list-item-title>
        </v-list-item>
    </v-list>
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

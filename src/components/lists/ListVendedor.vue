<template>
    <v-list flat dense>
        <v-list-item>
            <v-list-item-avatar size="50">
                <v-img :src="image+empresa.imagen"></v-img>
            </v-list-item-avatar>
            <v-list-item-title>
                {{empresa.nombre_comercial}}
            </v-list-item-title>
        </v-list-item>
        <v-list-item>
            <v-list-item-icon>
                <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                {{empresa.correo_electronico}}
            </v-list-item-title>
        </v-list-item>
        <v-list-item>
            <v-list-item-icon>
                <v-icon>mdi-cellphone</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                {{empresa.telefono1}}
            </v-list-item-title>
        </v-list-item>
    </v-list>
</template>

<script>
    import variables from '@/services/variables_globales';

    export default {
        props:{
            empresa:{
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

<template>
    <v-card elevation="0">
        <v-card-text>
            <v-row justify="center">
                <v-avatar size="100">
                    <v-img :src="image+empresa.imagen"></v-img>
                </v-avatar>
            </v-row>
            <v-list flat dense>
                <v-list-item>
                    <v-list-item-title class="body-1 font-weight-bold">
                        Nombre: {{empresa.nombre_comercial}}
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="body-1 font-weight-bold">
                        {{empresa.correo_electronico}}
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-cellphone</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="body-1 font-weight-bold">
                        {{empresa.telefono1}}
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

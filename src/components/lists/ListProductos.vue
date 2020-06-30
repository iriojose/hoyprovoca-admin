<template>
    <v-list>
        <v-list-item v-for="(producto,i) in productos" :key="i">
            <v-list-item-avatar size="60">
                <v-img :src="image+producto.imagen"></v-img>
            </v-list-item-avatar>
            <v-list-item-title>
                {{producto.nombre}}
            </v-list-item-title>
        </v-list-item>
    </v-list>
</template>

<script>
import variables from '@/services/variables_globales';

    export default {
        props:{
            productos:{
                type:Array,
                default:() => ([])
            }
        },
        data(){
            return {
                ...variables
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
<template>
    <v-list flat>
        <v-list-item v-for="(pago,i) in pagos" :key="i">
            <v-list>
                <v-list-item>
                    <v-list-item-avatar size="250" tile>
                        <v-img :src="image+pago.imagen"></v-img>
                    </v-list-item-avatar>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        Referencia:{{pago.codigo_referencia}}
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>
                        Monto:{{pago.monto}}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-list-item>
    </v-list>
</template>

<script>
import variables from '@/services/variables_globales';

    export default {
        props:{
            pagos:{
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
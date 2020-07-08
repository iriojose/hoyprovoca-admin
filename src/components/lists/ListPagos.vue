<template>
    <v-card elevation="0">
        <v-card-text v-for="(pago,i) in pagos" :key="i">
            <v-row justify="center">
                <v-avatar size="250" tile>
                    <v-img :src="image+pago.imagen"></v-img>
                </v-avatar>
            </v-row>
            <v-list flat dense>
                <v-list-item>
                    <v-list-item-title class="body-1 font-weight-bold">
                        Referencia: {{pago.codigo_referencia}}
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="body-1 font-weight-bold">
                        Monto: {{pago.monto}}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
import variables from '@/services/variables_globales';
import accounting from 'accounting';

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
        },
        watch: {
            pagos(){
                this.pagos.filter(a => accounting.formatMoney(+a.monto,{symbol:"Bs ",thousand:'.',decimal:','}));
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
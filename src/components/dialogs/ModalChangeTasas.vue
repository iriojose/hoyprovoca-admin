<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card height="500">
            <v-card-title>
                Nuevo Cargo
                <v-spacer></v-spacer>
                <slot name="close"></slot>
            </v-card-title>
        </v-card>
    </v-dialog>
</template>

<script>
//import Cambio from '@/services/Cambio';
import {mapState} from 'vuex';
import validations from '@/validations/validations';

    export default {
        props:{
            dialog:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                ...validations,
                tasa:{
                    adm_empresa_id:null,
                    moneda:'Dolares',
                    tasa:null,
                    principal:0,
                },
                valid:false,
                loading:false,
            }
        },
        computed: {
            ...mapState(['user'])
        },
        methods:{
            
        }
    }
</script>

<style lang="scss" scoped>

</style>
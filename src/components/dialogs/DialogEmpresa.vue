<template>
    <v-dialog v-model="dialogEmpresa" transition="dialog-bottom-transition" fullscreen>
        <v-card width="100%" height="100%">
            <v-card-title class="color">
                <v-btn icon @click="setDialogEmpresa(false)">
                    <v-icon color="#005598" x-large>
                        keyboard_arrow_left
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <div class="font-weight-bold title">
                    {{title}}
                </div>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
        </v-card>
    </v-dialog>
</template>

<script>

    export default {
        props:{
            title:{
                type:String,
                default:''
            },
            pedidos:{
                type:Array,
                default:() => []
            },
            conceptos:{
                type:Array,
                default:() => []
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
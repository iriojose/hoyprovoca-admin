<template>
    <v-dialog 
        v-model="dialog" width="400" 
        class="py-12" transition="dialog-bottom-transition" 
        :persistent="error"
    >
        <v-card>
            <v-card-text>
                <v-row justify="center" align="center">
                    <LoaderRect v-if="loading" class="py-12" />

                    <div v-if="!loading" class="py-12 text-center title font-weight-bold">
                        <div class="mb-3"><v-icon size="50" :color="color">{{icon}}</v-icon></div>
                        {{mensaje}}
                    </div>

                    <v-row justify="space-around" v-if="!loading && error">
                        <slot name="nuevo"></slot>
                        <slot name="close"></slot>
                    </v-row>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import LoaderRect from '@/components/loaders/LoaderRect';

    export default {
        components:{
            LoaderRect
        },
        props:{
            dialog:{
                type:Boolean,
                default:false
            },  
            loading:{
                type:Boolean,
                default:false
            },
            mensaje:{
                type:String,
                default:''
            },
            icon:{
                type:String,
                default:''
            },
            color:{
                type:String,
                default:''
            },
            error:{
                type:Boolean,
                default:true
            }
        },
    }
</script>

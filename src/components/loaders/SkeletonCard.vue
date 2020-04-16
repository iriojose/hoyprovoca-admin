<template>
    <v-container>
        <div class="headline ml-12 mt-12 font-weight-black">{{title}}</div>
        <v-slide-group show-arrows class="pa-5" v-model="model">
            <v-slide-item v-for="n in 8" :key="n">
                <v-card
                    elevation="4"
                    class="ma-2"
                    :height="height"
                    :width="width"
                >
                    <v-skeleton-loader :width="width" :height="height" type="image" />
                </v-card>
            </v-slide-item>
        </v-slide-group>
    </v-container>
</template>

<script>
    export default {
        inject: ["theme"],
        props:{
            width:{
                type:Number,
                default:0
            },
            height:{
                type:Number,
                default:0
            },
            title:{
                type:String,
                default:''
            }
        },
        data() {
            return {
                model:0
            }
        },
    };
</script>


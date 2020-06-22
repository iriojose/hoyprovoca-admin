<template>
    <v-card>
        <v-navigation-drawer
            v-model="drawers"
            :mini-variant.sync="mini"
            hide-overlay
            app
            class="mx-auto"
            color="#1f3b63"
        >
            <v-list-item class="px-2">
                <v-list-item-avatar size="50">
                    <v-img :src="require('@/assets/logo 4.png')"></v-img>
                </v-list-item-avatar>

                <v-list-item-title class="white--text font-weight-bold">Hoyprovoca</v-list-item-title>

                <v-btn icon @click.stop="mini = !mini">
                    <v-icon color="#fff">mdi-chevron-left</v-icon>
                </v-btn>
            </v-list-item>

            <v-divider class="mt-5 mb-2 back mx-5"></v-divider>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
import variables from '@/services/variables_globales';
import {mapState,mapActions} from 'vuex';

    export default {
        data() {
            return {
                ...variables,
                mini:true
            }
        },
        computed:{
            ...mapState(['drawer','user']),
            drawers:{
                get(){
                    return this.drawer;
                },
                set(val){
                    this.setDrawer(val);
                }
            }
        },
        methods:{
            ...mapActions(['setDrawer']),
        }
    }
</script>

<style lang="scss" scoped>
    .transition{
        transition:all 0.3s;
    }
    .transition:hover{
        transform:translateX(15px);
    }
    .back{
        background: rgba(255,255,255,0.3) !important;
    }

    .background{
        background:#fff;
    }
    .color{
        color:#3b61d1;
    }
    
</style>
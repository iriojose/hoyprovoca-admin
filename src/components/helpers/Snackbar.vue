<template>
    <v-snackbar 
        v-model="snackbars" 
        :color="!error == '' || !error == null ? '#C62828':'#2E7D32'" 
        right
        top
        class="mt-12"
        :timeout="2000"
    >
        <div v-if="!error == '' || !error == null">
            <v-icon dark>
                cancel
            </v-icon>
            {{error}}
        </div>
        <div v-else>
            <v-icon dark>
                check_circle
            </v-icon>
            {{exito}}
        </div>
    </v-snackbar>
</template>

<script>
import {mapState,mapActions} from 'vuex';

    export default {
        props:{
            error:{
                type:String,
                default:''
            },
            exito:{
                type:String,
                default:''
            }
        },
        computed: {
            ...mapState(['snackbar']),

            snackbars:{
                get(){
                    return this.snackbar;
                },
                set(val){
                    this.setSnackbar(val);
                }
            }
        },
        methods: {
            ...mapActions(['setSnackbar'])
        },
    }
</script>
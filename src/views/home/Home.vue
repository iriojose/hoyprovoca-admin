<template>
    <div v-if="$vuetify.breakpoint.smAndDown" class="mx-2 bottom top2">
        <router-view/>

        <div v-if="$route.name == 'dashboard'">
            <Dashboard />
        </div>
    </div>

    <div v-else :class="drawer ? 'top left bottom':'top right bottom'">
        <router-view/>

        <div v-if="$route.name == 'dashboard'">
            <Dashboard />
        </div>
    </div>
</template>

<script>
import Dashboard from '@/components/dashboard/Dashboard';
import {mapState} from 'vuex';

    export default {
        components:{
            Dashboard
        },
        computed: {
            ...mapState(['drawer'])
        },
        head:{
            title(){
                return {
                    inner:'Dashboard',
                    separator:' ',
                    complement: ' '
                }
            }
        },
    }
</script>

<style lang="scss" scope>
    .top{
        margin-top:30px;
        margin-right:20px;
    }
    .left{
        margin-left:300px;
    }
    .right{
        margin-left:20px;
    }
    .top2{
        margin-top:20px;
    }
    .bottom{
        margin-bottom:200px;
    }
</style>

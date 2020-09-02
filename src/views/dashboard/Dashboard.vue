<template>
    <div :class="$vuetify.breakpoint.smAndDown ? null:drawer ? 'left':null">
        <Dashboard />
    </div>
</template>

<script>
import {mapState} from 'vuex';

    export default {
        components:{
            Dashboard:() => import('@/components/dashboard/Dashboard')
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
    .left{
        margin-left:250px;
    }
</style>

<template>
    <div>

    </div>
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
<template>
    <div>
        hola
    </div>
</template>

<script>
import Movimiento_banco from '@/services/Movimiento_banco';

    export default {
        mounted(){
            this.getMovimientos();
        },
        methods:{
            getMovimientos(){
                Movimiento_banco().get("/?origen=PEDIDO").then((response)=> {
                    console.log(response.data.response);
                }).catch(e => {
                    console.log(e);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
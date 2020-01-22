<template>
    <div>

    </div>
</template>

<script>
import Conceptos from '@/services/Conceptos';

    export default {
        data() {
            return {
                resultados:[],
                search:''
            }
        },
        methods: {
            getConceptos(){
                Conceptos().get(`/`).then((response) => {
                    this.resultados = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            }
        },        
    }
</script>

<style lang="scss" scoped>

</style>
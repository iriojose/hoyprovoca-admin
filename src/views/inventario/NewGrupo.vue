<template>
    <div v-if="$route.name == 'nuevogrupo'">
        <Breadcrumbs :items="items"/>

    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import Grupos from '@/services/Grupos';

    export default {
        components:{
            Breadcrumbs
        },
        data() {
            return {
                data:{
                    nombre:'',
                    imagen:'default.png',
                    visualizar:0,
                    posicion:0
                },
                items: [
                    { text: 'Grupos', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
            }
        },
        methods: {
            postGrupos(){
                Grupos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .pointer{
        cursor:pointer;
    }
</style>
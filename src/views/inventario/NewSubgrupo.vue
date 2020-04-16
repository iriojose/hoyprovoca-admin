<template>
    <div v-if="$route.name == 'nuevosubgrupo'">
        <Breadcrumbs :items="items"/>
    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import SubGrupos from '@/services/SubGrupos';

    export default {
        components:{
            Breadcrumbs
        },
        data() {
            return {
                data:{
                    nombre:'',
                    adm_grupos_id:0,
                    imagen:'default.png',
                    visualizar:0,
                    posicion:0
                },
                items: [
                    { text: 'Subgrupos', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
            }
        },
        methods: {
            postSubgrupos(){
                SubGrupos().post("/",{data:this.data}).then((response) => {
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
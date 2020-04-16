<template>
    <div v-if="$route.name == 'nuevoproducto'">
        <Breadcrumbs :items="items"/>
    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';

    export default {
        components:{
            Breadcrumbs
        },
        data() {
            return {
                items: [
                    { text: 'Productos', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
            }
        },
    }
</script>

<style lang="scss" scoped>
    .pointer{
        cursor:pointer;
    }
</style>
<template>
    <div >
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
                    { text: 'Grupos', disabled: false},
                    { text: 'Editar', disabled: true },
                ],
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
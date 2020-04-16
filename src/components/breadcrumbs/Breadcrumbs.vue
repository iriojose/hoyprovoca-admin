<template>
    <v-breadcrumbs :items="items">
        <template v-slot:item="{ item }">
            <v-breadcrumbs-item
                @click="push"
                :disabled="item.disabled"
                class="pointer"
            >
                {{ item.text }}
            </v-breadcrumbs-item>
        </template>
    </v-breadcrumbs>
</template>

<script>
import router from '@/router';

    export default {
        props:{
            items:{
                type:Array,
                default:() => ([])
            }
        },
        methods: {
            push(){
                router.go(-1);
            }
        },
    }
</script>
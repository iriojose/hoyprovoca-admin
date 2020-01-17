<template>
    <v-navigation-drawer
        v-model="drawer"
        app
        permanent
        height="100%"
        width="80"
    >
        <v-list>
            <v-list-item v-for="n in 5" :key="n">
                <v-list-item-text>{{n}}</v-list-item-text>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        data(){
            return{
                drawer:true
            }
        }
    }
</script>
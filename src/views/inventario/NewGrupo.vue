<template>
    <div v-if="$route.name == 'nuevogrupo'">
        <v-row justify="center" class="mx-2">
            <v-card width="500" height="500" class="pa-5">
                holapapus
            </v-card>
        </v-row>
    </div>
</template>

<script>

    export default {
        
        data() {
            return {
                
            }
        },
        mounted() {
            let id = window.localStorage.getItem('editar');
            console.log(id);
        },
        
        
    }
</script>
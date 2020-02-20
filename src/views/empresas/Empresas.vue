<template>
    <div>
        <v-card class="mt-10">
            <v-sheet
                class="v-sheet--offset mx-auto title text-center white--text py-5"
                dark
                elevation="12"
                max-width="calc(100% - 32px)"
            >
                Empresas
            </v-sheet>

            <v-card-text>
                <TableEmpresa />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import TableEmpresa from '@/components/VistasInventario/TablasInventario/TableEmpresa';

    export default {
        components:{
            TableEmpresa
        },
        data(){
            return {    
                
            }
        },
    }
</script>

<style scope>
    .v-sheet--offset {
        top: -30px;
        position: relative;
    }

    .color{
        background-color: #f5f5f5;
    }
</style>
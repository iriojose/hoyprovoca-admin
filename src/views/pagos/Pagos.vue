<template>
    <div>
        <v-card class="mt-10">
            <v-sheet
                class="v-sheet--offset mx-auto title text-center white--text py-5"
                dark
                elevation="12"
                max-width="calc(100% - 32px)"
            >
                Pagos
            </v-sheet>

            <v-card-text>
                <TableFacturas />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import TableFacturas from '@/components/vistaPagos/TableFacturas';

    export default {
        components:{
            TableFacturas,
        },

    }
</script>


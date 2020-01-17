<template>
    <v-card elevation="15" height="500">
        <v-card-title>

        </v-card-title>
        <v-card-content>
            <v-container>
                <v-form v-model="valid" class="center" @submit.prevent="">
                    <v-row justify="center" align="center">
                        <v-col cols="12" md="6" sm="12" >
                            
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
        </v-card-content>
        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn depressed width="40%">
                Entrar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                valid:false
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
<template>
    <v-form v-model="valid" @submit.prevent="">  
        <v-row>
            
        </v-row>
    </v-form>
</template>

<script>
import SubGrupos from '@/services/SubGrupos';
import Grupos from '@/services/Grupos';

    export default {
        data() {
            return {
                grupos:[],
                snackbar:false,
                error:null,
                valid:false,
                data:{

                }
            }
        },
        mounted() {
            this.getGrupos();
        },
        methods: {
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos=response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            postSubGrupos(){
                this.error=null;
                SubGrupos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.snackbar = true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar = true;
                    this.error="Ocurrio un error.";
                });
            }
        },        
    }
</script>

<style lang="scss" scoped>

</style>
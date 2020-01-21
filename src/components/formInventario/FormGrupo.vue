<template>
    <v-form v-model="valid" @submit.prevent="">

    </v-form>
</template>

<script>
import Grupos from '@/services/Grupos';
    
    export default {
        data() {
            return {
                valid:false,
                snackbar:false,
                error:null,
                data:{

                }
            }
        },
        methods: {
            postGrupos(){
                this.error=null;

                Grupos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.snackbar=true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar=true;
                    this.error="Ocurrio un error.";
                })
            }
        },    
    }
</script>

<style lang="scss" scoped>

</style>
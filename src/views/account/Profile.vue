<template>
    <div>
        <v-card width="100%" class="pa-5">
            <div class="font-weight-black subtitle-1">Información de tu cuenta</div>

            <v-row justify="center" align="center" class="mt-2">
                <v-col cols="12" md="5" sm="12">
                    <div class="grey--text font-regular mb-2">Nombre(s)</div>
                    <v-text-field
                        single-line
                        solo
                        dense
                        color="#005598"
                        label="Nombre(s)"
                        v-model="data.nombre"
                        type="text"
                    />
                </v-col>
                <v-col cols="12" md="5" sm="12">
                    <div class="grey--text font-regular mb-2">Apellido(s)</div>
                    <v-text-field
                        solo
                        single-line
                        dense
                        color="#005598"
                        label="Apellido(s)"
                        v-model="data.apellido"
                        type="text"
                    />
                </v-col>
                <v-col cols="12" md="5" sm="12">
                    <div class="grey--text font-regular mb-2">Correo electrónico</div>
                    <v-text-field
                        solo
                        dense
                        single-line
                        color="#005598"
                        append-icon="mdi-lock"
                        disabled
                        label="Correo electrónico"
                        v-model="data.email"
                        type="text"
                    />
                </v-col>
                <v-col cols="12" md="5" sm="12">
                    <div class="grey--text font-regular mb-2">Telefono</div>
                    <v-text-field
                        label="Telefono"
                        solo
                        prepend-inner-icon="mdi-cellphone"
                        v-model="data.telefono"
                        :disabled="loading"
                        color="#005598"
                        dense
                        @input="changeCell"
                        hint="0000-000-0000"
                        persistent-hint
                        :rules="[required('Telefono'), minLength('Telefono',13)]"
                    />
                </v-col>
                <v-col cols="12" md="5" sm="12">
                    <div class="grey--text font-regular mb-2">Fecha de nacimiento</div>
                    <v-menu
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="date"
                                dense
                                label="Fecha de nacimiento"
                                hint="YYYY/MM/DD format"
                                persistent-hint
                                color="#005598"
                                append-icon="mdi-calendar-range"
                                solo
                                single-line
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker 
                            v-model="date" no-title 
                            header-color="#005598"
                            color="#005598"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-hover v-slot:default="{hover}">
                            <v-btn 
                                color="#005598" dark :elevation="hover ? 2:0" 
                                :loading="loading" @click="updateUsuario(user.data.id)"
                                class="text-capitalize body-2" :disabled="change ? true:false"
                            >
                                Atualizar datos
                            </v-btn>
                        </v-hover>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import Usuario from '@/services/Usuario';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                ...validations,
                change:false,
                loading:false,
                data:{},
                date: new Date().toISOString().substr(0, 10),
            }
        },
        mounted() {
            this.data = Object.assign({},this.user.data);
            this.data.fecha_nac = this.data.fecha_nac.substr(0,10);
        },
        computed:{
            ...mapState(['user'])
        },
        methods:{
            
            success(mensaje){
                this.$toasted.success(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-check-outline",
                });
                this.loading = false;
            },
            error(mensaje){
                this.$toasted.error(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-alert-octagon",
                });
                this.loading = false;
            },
            changeCell(){
                if(this.data.telefono.length == 4){
                    this.data.telefono+='-';
                }else if(this.data.telefono.length == 8){
                    this.data.telefono+='-';
                }
            },
            updateUsuario(id){
                this.loading = true;
                this.data.fecha_nac = this.date;
                Usuario().post(`/${id}`,{data:this.data}).then(() => {
                    this.success('Actualizado extisamente.');
                    this.user.data = this.data;
                    this.change = false;
                }).catch(e => {
                    console.log(e);
                    this.error('Opsss, Error al intentar actualizar.');
                });
            }
        }
    }
</script>
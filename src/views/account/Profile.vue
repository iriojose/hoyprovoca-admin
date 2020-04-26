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
                <!--v-col cols="12" md="5" sm="12">
                    <div class="grey--text font-regular mb-2">Celular</div>
                    <v-text-field
                        solo
                        single-line
                        dense
                        color="#005598"
                        append-icon="phone_iphone"
                        label="Celular"
                        prefix="0-"
                        v-model="telefono"
                        type="text"
                    />
                </v-col-->
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
                                label="Date"
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

        <Snackbar :mensaje="mensaje" :icon="icon" :color="color" />
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Usuario from '@/services/Usuario';
import Snackbar from '@/components/snackbars/Snackbar';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                mensaje:'',
                color:'',
                icon:'',
                change:false,
                loading:false,
                telefono:null,
                data:{},
                date: new Date().toISOString().substr(0, 10),
            }
        },
        mounted() {
            this.data = Object.assign({},this.user.data);
            this.date = this.data.fecha_nac.substr(0,10);
        },
        computed:{
            ...mapState(['user'])
        },
        methods:{
            ...mapActions(['setSnackbar']),
            
            mensajeSnackbar(color,icon,mensaje){
                this.color = color;
                this.icon = icon;
                this.mensaje = mensaje;
                this.setSnackbar(true);
                this.loading = false;
            },
            updateUsuario(id){
                this.loading = true;
                this.data.fecha_nac = this.date;
                Usuario().post(`/${id}`,{data:this.data}).then(() => {
                    this.mensajeSnackbar('#388E3C','mdi-check-outline','Actualizado extisamente.');
                    this.user.data = this.data;
                    this.change = false;
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Opsss, Error al intentar actualizar.');
                });
            }
        }
    }
</script>
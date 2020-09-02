<template>
    <div>
        <v-app-bar app color="#fff" elevation="0" :class="$vuetify.breakpoint.smAndDown ? null:'px-12'">  
            <v-spacer class="hidden-sm-and-up"></v-spacer>
            <v-avatar size="50">
                <v-img src="@/assets/2.png" />
            </v-avatar>
            <v-spacer></v-spacer>

            <v-btn class="text-capitalize font-weight-bold mx-2" text v-if="!$vuetify.breakpoint.smAndDown">
                Características
            </v-btn>
            <v-btn class="text-capitalize font-weight-bold mx-2" text v-if="!$vuetify.breakpoint.smAndDown">
                Nosotros
            </v-btn>
            <v-btn class="text-capitalize font-weight-bold mx-2" text v-if="!$vuetify.breakpoint.smAndDown">
                Planes
            </v-btn>
            <v-btn class="text-capitalize font-weight-bold mx-2 color" text to="/login" v-if="!$vuetify.breakpoint.smAndDown">
                Iniciar sesión
            </v-btn>
        </v-app-bar>

        <v-card width="100%" elevation="0" class="margen">
            <v-card-text>
                <div class="black--text display-1 text-capitalize font-weight-black text-center mb-5">Únete a nosotros y <span class="color">amplia</span> el alcance de tu negocio <!--comercializa y arranca tu <span class="color">negocio</span> ahora--></div>

                <v-row justify="center" class="mt-10">
                    <v-col cols="12" md="4" sm="12">
                        <v-row justify="space-around">
                            <v-btn to="/login" color="blue darken-4" class="text-capitalize white--text font-weight-bold">
                                Iniciar sesión
                            </v-btn>

                            <v-btn to="/register" color="blue darken-4" outlined class="text-capitalize font-weight-bold">
                                Intentalo
                            </v-btn>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row justify="center" class="mt-5">
                    <v-img contain width="500" height="400" src="@/assets/index.svg"></v-img>
                </v-row> 

                <div class=" black--text my-10 text-capitalize text-center headline font-weight-bold">un escudo para los acuerdos con sus clientes</div>
                
                <v-row justify="center" class="mb-12">
                    <v-col cols="12" md="10" sm="12">
                        <v-row justify="center">
                            <v-col cols="12" md="3" sm="12" v-for="(image,i) in images" :key="i">
                                <v-card outlined width="100%" height="200" class="pa-1 border scale">
                                    <v-card class="border" color="#e6e6e6" elevation="0" width="100%" height="150">
                                        <v-img contain width="100%" height="150" :src="require('@/assets/'+image.img)"></v-img>
                                        <div class="mt-2 text-capitalize text-center font-weight-bold">{{image.text}}</div>
                                    </v-card>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row justify="center">
                    <v-col cols="12" md="6" sm="12" class="px-10">
                        <div class="my-5 title font-weight-black black--text">Conoce un poco sobre nosotros</div>
                        <div class="text-left subtitle-2">
                            <span class="black--text">HoyProvoca</span> ha sido desarrollado por la empresa Somos Sistemas C.A, operando en el Estado <span class="black--text">Nueva Esparta, Venezuela.</span> Nuestra misión es la de ofrecer una plataforma de confianza donde se pueda virtualizar el mercado venezolano, y donde cada empresa pueda ofrecer diferentes bienes para el consumo final.
                            <br><br>
                            Nuestra plataforma es un sitio de consumo de alto crecimiento, enfocada a la oferta de servicios que permitan conectar a consumidores, transportistas y distribuidores en un sitio que permita la oferta de <span class="black--text">productos alimenticios, tecnológicos, y mucho más.</span> Provenientes de nuestros aliados locales.
                            <br><br>
                            <span class="black--text subtitle-1">¡No te pierdas de una experiencia inolvidable!</span>
                        </div>

                        <v-btn to="/register" color="blue darken-4" outlined class="my-5 text-capitalize font-weight-bold">
                            Intentalo
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                        <v-row justify="center">
                            <v-img src="@/assets/team.svg" contain width="100%" height="400"></v-img>
                        </v-row>
                    </v-col>
                </v-row>

                <div class="mt-12 font-weight-black black--text text-center headline text-capitalize">Planes flexibles</div>
                <br>
                <div class="text-center text-capitalize subtitle-1 fotn-weight-bold">elija un plan que funcione mejor para</div>
                <div class="text-center text-capitalize subtitle-1 fotn-weight-bold">usted y su equipo</div>
            
                <v-row justify="space-around" class="my-10">
                    <v-col cols="12" sm="12" md="9">
                        <v-row justify="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2':null">
                            <v-col cols="12" md="3" sm="12" v-for="(plan,i) in planes" :key="i">
                                <v-card elevation="5" width="100%" height="300" :class="i==1? 'scale2 border my-5':'border my-5'" :color="i==1? '#232323':'#fff'">
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-chip right small class="mx-2 white--text caption text-capitalize" color="#0D47A1" v-if="i==1">
                                            Popular
                                        </v-chip>
                                    </v-card-actions>

                                    <v-row justify="center" :class="i==1 ? 'mx-2':'mx-2 my-4'">
                                        <v-col cols="4" md="4" sm="4">
                                            <v-avatar size="50" :color="plan.color">
                                            </v-avatar>
                                        </v-col>
                                        <v-col cols="8" md="8" sm="8">
                                            <div :class="i==1 ? 'text-left white--text text-capitalize font-weight-black':'text-left black--text text-capitalize font-weight-black'">{{plan.title}}</div>
                                            <div :class="i==1 ? 'text-left white--text text-capitalize font-weight-black':'text-left black--text text-capitalize font-weight-black'">{{plan.precio}} / User</div>
                                        </v-col>
                                    </v-row>

                                    <v-divider class="my-5" :dark="i==1? true:false"></v-divider>

                                    <div v-for="(beneficio,e) in plan.beneficios" :key="e" class="mx-4">
                                        <div :class="i==1 ? 'caption text-capitalize white--text':'caption text-capitalize'">
                                            <v-icon :color="i==1 ? '#fff':'#000'">mdi-check</v-icon>
                                            {{beneficio.text}}
                                        </div>
                                    </div>

                                    <v-row justify="center" :class="i==1 ? 'my-2':'my-5'">
                                        <v-btn small to="/register" color="#0D47A1" class="white--text text-capitalize caption border font-weight-bold">
                                            Elige un plan
                                            <v-icon color="#fff" class="mx-2">mdi-chevron-right</v-icon>
                                        </v-btn>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {
        head:{
            title(){
                return {
                    inner:'Inicio',
                    separator:' ',
                    complement: ' '
                }
            }
        },
        data(){
            return {
                images:[
                    {img:"finance.svg",text:"Incrementa tus ganancias"},
                    {img:"collaborator.svg",text:"Amplifica tu reputación"},
                    {img:"online collaborator.svg",text:"Genera nuevas oportunidades"},
                    {img:"subscription.svg",text:"Maneja tus recursos"},
                ],
                planes:[
                    {
                        title:"Emprende",
                        precio:"Free",
                        color:"#EF5350",
                        beneficios:[
                            {text:"20 productos."},
                            {text:"Se retiene 10%."},
                            {text:"Membresía gratuita."},
                        ]
                    },
                    {
                        title:"Distribuidor",
                        precio:"20$",
                        color:"#43A047",
                        beneficios:[
                            {text:"120 productos."},
                            {text:"Se retiene 15%."},
                            {text:"Cargas masivas."},
                            {text:"modulo de Estadísticas."},
                        ]
                    },
                    {
                        title:"Retail",
                        precio:"10$",
                        color:"#AB47BC",
                        beneficios:[
                            {text:"60 productos."},
                            {text:"se retiene 9%."},
                            {text:"Cargas masivas."},
                        ]
                    }
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>
    .color{
        color:#0D47A1;
    }
    .margen{
        margin-top:80px;
    }
    .border{
        border-radius:5%;
    }
    .scale{
        transition:all 0.3s;
    }
    .scale:hover{
        transition:all 0.3s;
        transform:scale(1.1);
    }
    .scale2{
        transform:scale(1.1);
    }
</style>
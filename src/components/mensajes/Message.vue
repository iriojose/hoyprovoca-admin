<template>
    <div class="py-5 text-center title font-weight-bold">
        <div class="mb-3"><v-icon size="50" :color="color">{{icon}}</v-icon></div>
        {{mensaje}}
    </div>
</template>

<script>
    export default {
        props:{
            color:{
                type:String,
                default:''
            },
            mensaje:{
                type:String,
                default:''
            },
            icon:{
                type:String,
                default:''
            },
        }
    }
</script>
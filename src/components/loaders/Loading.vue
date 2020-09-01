<template>
    <div class="loader-container">
        <div class="spinner yellow">
        </div>
        <v-img width="80" height="80" src="@/assets/2.png" class="abs-center blink"></v-img>
    </div>
</template>

<style lang="scss" scoped>
    .loader-container {
        width: 100px;
        height: 100px;
        position: relative;
    }
    @keyframes spinner {
        to {transform: rotate(360deg);}
    }
    @keyframes blink {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    .spinner {
        content: '';
        box-sizing: border-box;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 4px solid #f6f6f7;
        border-top-color: #02AE5A;
        animation: spinner 1s linear infinite;
    }
    .spinner.white {
        border: 4px solid #fff;
        border-top-color: #02AE5A;
    }
        
    .spinner.black {
        border: 4px solid #262626;
        border-top-color: #262626;
    }
    .spinner.yellow {
        border: 4px solid #FFC107;
        border-top-color: #fff;
    }
    .abs-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .blink {
        animation: blink 1.5s linear infinite;
    }
</style>
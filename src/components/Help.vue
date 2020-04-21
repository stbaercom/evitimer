<template>
    <div id="pagehelp">
        <img src="@/assets/help/timer_view.png">
        <img src="@/assets/help/buffer.png">
        <img src="@/assets/help/quick_actions.png">
        <img src="@/assets/help/preferences.png">
    </div>
</template>

<script>


    export default {
        name: 'Help',
    }
</script>

<style>
    #pagehelp {
        font-family: 'jetbrains_monoregular';
        color: #2c3e50;
        display: flex;
        align-content: center;
        justify-content: center;
        flex-direction: column;
    }

    img {
        align-self: center;
    }


    @font-face {
        font-family: 'jetbrains_monobold_italic';
        src: url('../assets/fonts/jetbrainsmono-bold-italic-webfont.woff2') format('woff2'),
        url('../assets/fonts/jetbrainsmono-bold-italic-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monobold';
        src: url('../assets/fonts/jetbrainsmono-bold-webfont.woff2') format('woff2'),
        url('../assets/fonts/jetbrainsmono-bold-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monoXBdIt';
        src: url('../assets/fonts/jetbrainsmono-extrabold-italic-webfont.woff2') format('woff2'),
        url('../assets/fonts/jetbrainsmono-extrabold-italic-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monoextrabold';
        src: url('../assets/fonts/jetbrainsmono-extrabold-webfont.woff2') format('woff2'),
        url('../assets/fonts/jetbrainsmono-extrabold-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monoitalic';
        src: url('../assets/fonts/jetbrainsmono-italic-webfont.woff2') format('woff2'),
        url('../assets/fonts/jetbrainsmono-italic-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monomedium_italic';
        src: url('../assets/fonts/jetbrainsmono-medium-italic-webfont.woff2') format('woff2'),
        url('../assets/fonts/jetbrainsmono-medium-italic-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monomedium';
        src: url('../assets/fonts/jetbrainsmono-medium-webfont.woff2') format('woff2'),
        url('../assets/fonts/jetbrainsmono-medium-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monoregular';
        src: url('../assets/fonts/jetbrainsmono-regular-webfont.woff2') format('woff2'),
        url('../assets/fonts/jetbrainsmono-regular-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


</style>

<template>
    <div id="app">
        <Counter :size="200"></Counter>
    </div>
</template>

<script>

    import {EVS} from "./support/constants"

    import Counter from './components/Counter.vue'


    const handlerEvents = [
        {
            key: ["Enter"],
            event: "confirm"
        },
        //{key: [" "], event: "pause"},
        {
            key: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            event: "append"
        },
        {
            key: ["+", "-", "=", "t"],
            event: "setmode"
        },
        {
            key: ["Escape"],
            event: "escape"
        },
        {
            key: ["Backspace"],
            event: "remove"
        },
    ]


    export default {
        name: 'App',
        components: {
            Counter
        },
        mounted() {
            window.addEventListener('keyup', this.handleKeyUp);
            this.eventBus.$on(EVS.EV_PREFERENCES, this.show_preferences)

        },
        methods: {
            handleKeyUp(ev) {
                ev.preventDefault()

                for (const he of handlerEvents) {
                    for (const k of he.key) {
                        if (k == ev.key) {
                            this.eventBus.$emit(he.event, {key: k})
                        }
                    }
                }
            }
        },
        inject: ["eventBus"],
        provide() {
            return {
                icon_size: 24
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'jetbrains_monoregular';
        color: #2c3e50;
        overflow: hidden;
        display: flex;
        align-content: center;
        justify-content: center;
    }


    @font-face {
        font-family: 'jetbrains_monobold_italic';
        src: url('assets/fonts/jetbrainsmono-bold-italic-webfont.woff2') format('woff2'),
        url('assets/fonts/jetbrainsmono-bold-italic-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monobold';
        src: url('assets/fonts/jetbrainsmono-bold-webfont.woff2') format('woff2'),
        url('assets/fonts/jetbrainsmono-bold-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monoXBdIt';
        src: url('assets/fonts/jetbrainsmono-extrabold-italic-webfont.woff2') format('woff2'),
        url('assets/fonts/jetbrainsmono-extrabold-italic-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monoextrabold';
        src: url('assets/fonts/jetbrainsmono-extrabold-webfont.woff2') format('woff2'),
        url('assets/fonts/jetbrainsmono-extrabold-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monoitalic';
        src: url('assets/fonts/jetbrainsmono-italic-webfont.woff2') format('woff2'),
        url('assets/fonts/jetbrainsmono-italic-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monomedium_italic';
        src: url('assets/fonts/jetbrainsmono-medium-italic-webfont.woff2') format('woff2'),
        url('assets/fonts/jetbrainsmono-medium-italic-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monomedium';
        src: url('assets/fonts/jetbrainsmono-medium-webfont.woff2') format('woff2'),
        url('assets/fonts/jetbrainsmono-medium-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


    @font-face {
        font-family: 'jetbrains_monoregular';
        src: url('assets/fonts/jetbrainsmono-regular-webfont.woff2') format('woff2'),
        url('assets/fonts/jetbrainsmono-regular-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;

    }


</style>

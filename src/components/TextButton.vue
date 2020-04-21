<template>
    <button
            class="textbutton"
            @click="handler"
            :style="[pos_icon]"
            v-b-tooltip.hover
            :title="tooltip"
    >
        <span>{{icontext}}</span>
    </button>
</template>

<script lang="ts">

    import {Component, Vue, Prop} from "vue-property-decorator";
    import {StringMap} from "@/support/timertypes";

    @Component
    export default class TextButton extends Vue {


        @Prop({required: true}) readonly handler!: (a: Event) => void
        @Prop({required: true}) readonly icontext!: string
        @Prop({required: true}) readonly tooltip!: string
        @Prop({required: true}) readonly positions!: StringMap
        @Prop({required: true}) readonly size!: number


        get pos_icon(): StringMap {
            const {top, left, inline = false, x = 0, y = 0, z = 'auto'} = this.positions

            if (!inline) {
                return {
                    "width": `${this.size}px`,
                    "height": `${this.size}px`,
                    "position": "absolute",
                    "top": `${top}%`,
                    "left": `${left}%`,
                    "z-index": `${z}`,
                    "transform": `translateX(${x}%) translateY(${y}%)`,
                }
            } else {
                return {
                    "position": "static",
                    "display": "inline-block",
                    "margin": "10px"
                }
            }
        }
    }
</script>

<style scoped>

    .textbutton {
        border: 1px black solid;
        border-radius: 5px;
        padding: 0px 5px;
        outline: 0;

    }

    .textbutton:hover {
        outline: 1px solid black;
        outline-offset:3px;
    }

</style>

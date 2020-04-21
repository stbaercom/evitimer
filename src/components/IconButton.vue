<template>


    <div :style="[icon_style]">
        <b-button :disabled="disabled"
                ref="button"
                variant="outline-secondary"
                :id="$id('tt')"
                :title="tooltip"
                @click="call_handler"
                class="ibtn"
        >
            <img :class={disabled:disabled} :src="icon_src">


        </b-button>

        <b-tooltip :target="$id('tt')" triggers="hover">
            {{tooltip}}
        </b-tooltip>

    </div>


</template>

<script lang="ts">

    import {Component, Vue, Prop} from "vue-property-decorator"

    import {StringMap} from "@/support/timertypes"


    @Component
    export default class IconButton extends Vue {

        @Prop({required: true}) readonly handler!: (a: Event) => void
        @Prop({required: true}) readonly iconname!: string
        @Prop({required: true}) readonly tooltip!: string
        @Prop() readonly positions!: StringMap
        @Prop({required: true}) readonly size!: string
        @Prop({ default: false }) readonly disabled!: boolean



        get sizestyle(): StringMap {
            const rx = /[^\d.]/
            let suffix

            if (rx.test(this.size)) {
                suffix = ""
            } else {
                suffix = "px"
            }

            return {
                "width": `${this.size}${suffix}`,
                "height": `${this.size}${suffix}`,
                "line-height": `${this.size}${suffix}`
            }

        }


        get icon_style(): StringMap {
            const size = this.sizestyle
            if (this.positions) {
                const {top, left, x = 0, y = 0, z = 'auto'} = this.positions
                return {
                    ...size,
                    "position": "absolute",
                    "top": `${top}%`,
                    "left": `${left}%`,
                    "z-index": `${z}`,
                    "transform": `translateX(${x}%) translateY(${y}%)`,
                }
            } else {
                return {
                    ...size,
                    "display": "inline-block"
                }
            }
        }

        get icon_src(): string {
            const svgs = require.context("@/assets/icons", false, /\.svg$/)
            return svgs(`./${this.iconname}.svg`)
        }

        call_handler(ev: Event) {
            // eslint-disable-next-line
            (this.$refs['button'] as any).blur()
            this.handler(ev)
        }
    }

</script>


<style scoped>

    .ibtn {
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        width: 100%;
        height: 100%;
    }

    button {
        -webkit-app-region: no-drag;
    }

    .disabled {
        /*border: 1pt solid red;*/
        filter: invert(50%) saturate(3%);
    }


</style>

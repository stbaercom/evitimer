<template>
    <div class="base-timer_label">
        <div v-if="showhours" class="main">
            <span class="text-main-large-6">{{hours}}</span>
            <span class="text-main-small-6">h</span>
            <span class="text-main-large-6">{{minutes}}</span>
            <span class="text-main-small-6">m</span>
            <span class="text-main-large-6">{{seconds}}</span>
            <span class="text-main-small-6">s</span>
        </div>

        <div v-else class="main">
            <span class="text-main-large-4">{{minutes}}</span>
            <span class="text-main-small-4">m</span>
            <span class="text-main-large-4">{{seconds}}</span>
            <span class="text-main-small-4">s</span>
        </div>

        <div class="support">
            <span class="text-support-small">{{support_text}}:</span>
            <span class="text-support-large">{{support_hours}}:{{support_minutes}}</span>
        </div>
    </div>
</template>

<script lang="ts">

    import {TimeControlInterface} from "@/support/displaycontroller";
    import {secs2buffer} from "../support/support";
    import moment from 'moment';
    import {Component, Vue, Prop, Watch} from "vue-property-decorator";

    @Component
    export default class TimeLabel extends Vue {

        @Prop() readonly time!: number
        @Prop() readonly size!: number
        @Prop() readonly now!: moment.Moment
        @Prop() readonly controller!: TimeControlInterface

        @Watch('now')
        now_changed(_cur: moment.Moment, _old: moment.Moment): void {
            const [hs, ms, txt] = this.controller.support_time(this.now,this.time)
            this.support_hours = hs
            this.support_minutes = ms
            this.support_text = txt
        }

        private support_text: string = ""
        private show_h: boolean = false
        private support_hours: string = "00"
        private support_minutes: string = "00"

        get hours() {
            return this.formattedTime.slice(0, 2)
        }

        get minutes() {
            return this.formattedTime.slice(2, 4)
        }

        get seconds() {
            return this.formattedTime.slice(4, 6)
        }


        get showhours(): boolean {
            return this.time >= 60 * 60
        }



        get formattedTime(): string {
            if (isNaN(this.time)) {
                return "??????"
            }
            if (this.time < 0) {
                return "000000"
            }
            const b = secs2buffer(this.time)
            const result = b.reduce((c, a) => c.toString() + a, "")
            return result

        }
    }

</script>

<style scoped>

    .base-timer_label {
        font-family: jetbrains_monobold;
        color: black;
        top: 52%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        line-height: 0.8;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 22pt;
    }

    .main {
        flex-basis: auto;
    }

    .support {
        flex-basis: auto;
    }

    .text-main-large-6 {
        font-weight: bolder;
        font-size: 1em;
        margin: -0.02em;
    }

    .text-main-small-6 {
        font-size: 0.5em;
        color: gray;
    }


    .text-main-large-4 {
        font-weight: bolder;
        font-size: 1.35em;
        margin: -0.02em;
    }

    .text-main-small-4 {
        font-size: 0.65em;
        color: gray;
    }


    .text-support-large {
        font-weight: bolder;
        font-size: .66em;
    }

    .text-support-small {
        font-size: .33em;
        color: gray;
    }


</style>

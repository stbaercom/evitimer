<template>
    <div @click="dismiss" class="alarm" :style="[mainstyle]">
        <div class="dismiss">Click to Dismiss</div>
    </div>
</template>

<script lang="ts">


    import {Component, Vue, Prop} from "vue-property-decorator"
    import {VStyle} from "@/support/timertypes";

    const TIME_PER_TICK = 500;
    const ALARM_ACTIVE = 10000;

    function get_audio(): HTMLAudioElement {
        const mp3s = require.context("@/assets/sounds", false, /\.mp3$/)
        const mp3 = mp3s("./ring.mp3")
        const audio = new Audio(mp3);
        audio.loop = true
        return audio
    }


    @Component
    export default class Alarm extends Vue {

        private audio: HTMLAudioElement | undefined = undefined;
        // eslint-disable-next-line
        private timer: any = -1
        private timer_set: boolean = false
        private count = 0
        @Prop({required: true}) readonly ring!: boolean


        dismiss() {
            this.audio?.pause()

            this.$emit("dismissed")
        }

        tick() {
            if (this.audio!= undefined && this.count > (ALARM_ACTIVE / TIME_PER_TICK)) {
                this.audio.pause()
            }
            this.count += 1
        }

        get mainstyle(): VStyle {
            const color = (this.count % 2 == 0 || this.count > (ALARM_ACTIVE / TIME_PER_TICK)) ? "red" : "white"
            return {"background-color": `${color}`}
        }

        created() {
            this.timer = setInterval(() => this.tick(), TIME_PER_TICK)
            this.timer_set = true
            this.audio = get_audio()
        }

        beforeDestroy() {
            if (this.timer_set) {
                clearInterval(this.timer)
            }

        }

        mounted() {
            if (this.ring && this.audio != undefined) {
                this.audio.play()
            }
        }
    }


</script>

<style scoped>
    .alarm {
        position: absolute;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: 0.3s linear all;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dismiss {
        font-weight: bold;
        font-size: 16pt;
    }


</style>

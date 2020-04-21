<template>
    <div class="message"
         :class="{hide: is_css_hide}"
         :style="messagestyle">
        {{message}}
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Inject} from "vue-property-decorator"
    import {StringMap} from "@/support/timertypes"


    const TIME_VISABLE = 2000

    @Component
    export default class Message extends Vue {
        @Inject() eventBus!: Vue
        private message: string = "";
        private is_css_hide = true
        private is_show = false

        get messagestyle(): StringMap {
            return {
                "display": this.is_show ? "flex" : "none"
            }
        }


        created() {
            this.eventBus.$on("showmessage", (v: { "text": string }) => {
                this.is_css_hide = true
                this.is_show = true
                this.message = v.text


                setTimeout(() => {
                    this.is_css_hide = false
                }, 10)
                setTimeout(() => {
                    this.is_css_hide = true
                }, TIME_VISABLE)
                setTimeout(() => {
                    this.is_show = false
                }, TIME_VISABLE + 300)


            })

            this.eventBus.$on("second_tick", () => {
                const _a = 1
            })

        }


    }

</script>


<style scoped>

    .message {
        border: 1px black solid;
        border-radius: 5px;
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 200px;
        z-index: 500;
        background-color: white;
        font-size: 16pt;
        opacity: 100%;
        overflow: hidden;
        transform: translateY(0);
        justify-content:center;
        align-items:center;
        transition: transform 0.3s, opacity 0.3s;
    }

    .message.hide {
        opacity: 20%;
        width: 200px;
        height: 200px;
        transform: translateY(-200px);
    }


</style>

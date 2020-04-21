<template>


        <div  class="buffer">
            <div class="mode_text">{{buffer_mode_text}}</div>

            <div class="cell_row">
                <div class="icon">{{buffer_mode_icon}}</div>
                <BufferCell  :val="hours" :idx="0" @changed="cellchanged"></BufferCell>
                <div class="sep">:</div>
                <BufferCell  :val="minutes" :idx="2" @changed="cellchanged"></BufferCell>
                <div class="sep">:</div>
                <BufferCell  :val="seconds" :idx="4" @changed="cellchanged"></BufferCell>
            </div>


            <div class="mode_text">&#x21B5;to confirm</div>
        </div>
</template>

<script lang="ts">

    import {Component, Vue, Inject, Prop} from "vue-property-decorator"
    import {KeyInputEvent, BufferData, StringMap} from "@/support/timertypes"


    import {
        getBufferData as getBuffer,
        buffer2secs,
        buffer_append,
        buffer2time,
        buffer_remove,
        buffer_change_hms,
    } from "../support/support"





    import BufferCell from "@/components/BufferCell.vue";
    import {ChangeEvent} from "@/components/BufferCell.vue";


    const MODE_PLUS = "mode_plus"
    const MODE_MINUS = "mode_minus"
    const MODE_SET = "mode_set"
    const MODE_TO = "mode_to"

    @Component({
        components: {
            BufferCell
        }
    })
    export default class NewBuffer extends Vue {
        @Inject() readonly eventBus!: Vue
        @Prop() readonly hide!: () => void
        @Prop() readonly show!: () => void
        @Prop() readonly visible!: () => boolean


        private buffer: BufferData
        private buffer_mode: string

        get buffer_mode_icon(): string {
            const m = new Map()
            m.set(MODE_SET, "=")
            m.set(MODE_MINUS, "-")
            m.set(MODE_PLUS, "+")
            m.set(MODE_TO, ">")
            return m.get(this.buffer_mode) || ""
        }

        get buffer_mode_text(): string {
            const m = new Map()
            m.set(MODE_SET, "Set total length of imer")
            m.set(MODE_MINUS, "Remove from timer")
            m.set(MODE_PLUS, "Add to timer")
            m.set(MODE_TO, "Enter timer end time")
            const result: string = m.get(this.buffer_mode) || ""
            return result
        }


        get hours(): number {
            return this.buffer[0] * 10 + this.buffer[1]
        }

        get minutes(): number {
            return this.buffer[2] * 10 + this.buffer[3]
        }

        get seconds(): number {
            return this.buffer[4] * 10 + this.buffer[5]
        }




        get buffer_fmt(): string {
            const b = this.buffer
            const result = `${b[0]}${b[1]}:${b[2]}${b[3]}:${b[4]}${b[5]}`
            return result
        }


        constructor() {
            super();
            this.buffer = getBuffer()
            this.buffer_mode = MODE_SET

            this.eventBus.$on("confirm", this.confirm)
            this.eventBus.$on("append", this.append)
            this.eventBus.$on("setmode", this.setmode)
            this.eventBus.$on("escape", this.escape)
            this.eventBus.$on("remove", this.remove)
        }



        cellchanged(p: ChangeEvent) {
            this.buffer = buffer_change_hms(this.buffer,p.idx,p.val)
            this.edit_refresh()
        }

        confirm(_: KeyInputEvent): void {

            if (!this.visible) {
                return
            }

            if (this.buffer_mode == MODE_SET) {
                const seconds = buffer2secs(this.buffer);
                this.$emit("new_timer", {seconds: seconds})
            } else if (this.buffer_mode == MODE_MINUS) {
                const seconds = buffer2secs(this.buffer) * -1;
                this.$emit("increase_timer", {seconds: seconds})
            } else if (this.buffer_mode == MODE_PLUS) {
                const seconds = buffer2secs(this.buffer);
                this.$emit("increase_timer", {seconds: seconds})
            } else if (this.buffer_mode == MODE_TO) {
                const [seconds, success] = buffer2time(this.buffer)
                if (success) {
                    this.$emit("new_timer", {seconds: seconds})
                } else {
                    const msg = "Not a valid time";
                    this.show_message(msg);
                }
            } else throw new Error("Mode unknown")
            this.buffer_mode = MODE_SET
            this.buffer = getBuffer()
            this.hide()
        }

        private show_message(msg: string) {
            this.eventBus.$emit("showmessage", {text: msg});
        }

        append(pl: KeyInputEvent): void {
            const c = pl.key
            this.buffer = buffer_append(this.buffer, c)
            this.edit_refresh()
        }

        edit_refresh(): void {
            this.show()
        }

        setmode(pl: KeyInputEvent): void {
            if (!this.visible) {
                return
            }
            const m = pl.key
            const t: StringMap = {
                "t": MODE_TO,
                "+": MODE_PLUS,
                "-": MODE_MINUS,
                "=": MODE_SET
            }
            const v = t[m]
            if (v === undefined) throw new Error(`Value ${m} is not a valid mode`)
            this.buffer_mode = v
        }

        escape(_: KeyInputEvent): void {
            this.hide()
        }

        remove(_: KeyInputEvent): void {
            if (!this.visible) {
                return
            }
            this.buffer = buffer_remove(this.buffer)
        }


    }


</script>


<style scoped>


    .cell_row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 20pt;
    }

    .buffer {
        font-family: jetbrains_monobold;
        margin: 0px;
        padding: 0px;
        border: 1px black solid;
        border-radius: 5px;
        left: 50%;
        overflow: hidden;
        text-align: center;
        font-size: 16pt;
        font-weight: bolder;
        background-color: white;
        line-height: 120%;
        /*height: 35px;*/

    }

    .edit_mode_indicator {
        width: 10%;
        font-size: 1.5em;
        padding-left: 10px;
        font-family: jetbrains_monobold;
    }

    .buffer_annotation {
        margin: 0px;
        padding: 0px;
        text-align: center;
        font-size: 1em;
        font-weight: bolder;
        background-color: white;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: flex-start;


        /*height: 35px;*/

    }




    .buffer_annotation img {
        height: 24px;
        width: 24px;
    }


    .mode_text {
        font-size: .6em;
    }

    .time {
        font-size: 1.2em;
    }

    .icon {
        font-size: 1.4em;
        color: gray;
        margin-right: 5px;
    }



</style>

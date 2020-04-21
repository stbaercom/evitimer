<template>

    <div style="-webkit-app-region: drag; position:absolute;">
        <TimeDisplayKonva
                ref="timedisplay"
                :timestate="timestate"
                :animate="animation"
                :size="size"
                :now="now"
                :controller="timeDisplayController">
        </TimeDisplayKonva>

        <IconButton
                :size="icon_size * 1.2"
                :handler="pause"
                tooltip="Pause/Resume"
                :iconname="state_is_running ? 'stop' : 'start'"
                :positions="{top: 20, left: 50,x: -50, y:0}">
        </IconButton>

        <IconButton
                :size="icon_size"
                :handler="handle_reset"
                iconname="reset"
                tooltip="Reset"
                :positions="{ top: 20, left: 50, x: -175,y: 0}">
        </IconButton>


        <IconButton
                :size="icon_size"
                :handler="switch_timer_stopwatch"
                tooltip="Switch Timer/Stopwatch"
                :iconname="state_is_timer ? 'is_timer' : 'is_stopwatch'"
                :positions="{ top: 20, left: 50, x: 75,y: 0}">
        </IconButton>


        <Alarm
                v-if="showalarm && pref_alarm"
                :ring={pref_ring}
                @dismissed="showalarm=false">
        </Alarm>


        <Message ref="message"></Message>


        <Dialog
                ref="preferences_modal"
                title="Preferences"
                :commit="commit_preferences"
        >
            <Preferences ref="preferences"></Preferences>
        </Dialog>


        <IconButton
                :size="icon_size"
                :handler="() => show_ref_modal('preferences_modal')"
                tooltip="Show Preferences"
                iconname="preferences"
                :positions="{top: 100, left: 100,x: -200, y:-100}">
        </IconButton>


        <Dialog ref="actions_modal" title="Actions">
            <template v-slot:default="{ hide }">
                <PopupMenu :hide="hide"></PopupMenu>
            </template>
        </Dialog>


        <IconButton
                :size="icon_size"
                :handler="() => show_ref_modal('actions_modal')"
                iconname="menu"
                tooltip="Show Action Menu"
                :positions="{top: 100, left: 100,x: -100, y:-100}">
        </IconButton>


        <IconButton
                :size="icon_size"
                :handler="alarm_toogle_handler"
                :iconname="alarm_toggle_icon"
                :tooltip="alarm_toggle_tooltip"
                :positions="{top: 65, left: 50,x: -50, y:40}">
        </IconButton>


        <Dialog ref="set_modal" title="Set Timer">
            <template v-slot:default="{ hide,show,visible }">
                <NewBuffer
                        :hide="hide"
                        :show="show"
                        :visible="visible"
                        @new_timer="new_timer($event['seconds'])"
                        @increase_timer="increase_timer($event['seconds'])">
                </NewBuffer>
            </template>
        </Dialog>

        <!--        SET -->
        <IconButton
                :size="icon_size * 1.2"
                :handler="() => show_ref_modal('set_modal')"
                iconname="set"
                tooltip="Set the Timer"
                :positions="{top: 100, left: 0,x: 0, y:-100}">
        </IconButton>

        <!--PIN -->
        <IconButton
                v-if="is_electron"
                :size="icon_size"
                :handler="() => this.change_pref_ontop(!this.pref_ontop)"
                :iconname="this.pref_ontop? 'pin' : 'no_pin'"
                tooltip="Pin to top"
                :positions="{top: 0, left: 100,x: -100, y:0}">
        </IconButton>

        <API ref="api"></API>

    </div>

</template>


<script lang="ts">

    import moment from 'moment';
    import {TimeState} from "@/support/timertypes";
    import Dialog from "@/components/Dialog.vue"
    import PopupMenu from "@/components/PopupMenu.vue";
    import TimeDisplayKonva from "@/components/TimeDisplayKonva.vue";
    import Alarm from "@/components/Alarm.vue";
    import IconButton from "@/components/IconButton.vue";
    import NewBuffer from "@/components/NewBuffer.vue"
    import Preferences from "@/components/Preferences.vue";
    import Message from "@/components/Message.vue";
    import API from "@/components/API.vue";
    import {backend} from "@/api/api_common"
    import * as ty from "@/support/timertypes"

    import {PREF_AFTERTIMER} from "../support/constants";
    import {OPS} from "@/support/constants"

    import {getBufferData} from "../support/support"
    import {TimerControl, StopwatchControl} from "../support/displaycontroller";
    import {BufferData, MenuAction, StringMap} from "@/support/timertypes"


    import {Component, Vue, Prop, Inject, Watch,} from "vue-property-decorator"
    // import {State, Mutation} from 'vuex-class'
    import {namespace} from 'vuex-class'

    const cos = namespace('cos')


    @Component({
        components: {
            API, PopupMenu, Dialog, TimeDisplayKonva, Alarm, IconButton, NewBuffer, Preferences, Message
        }
    })
    export default class Counter extends Vue {

        @Inject() eventBus!: Vue
        @Inject() icon_size!: number
        @Prop() readonly size!: number


        private is_edit_mode: boolean = false;

        private now: moment.Moment = moment()


        private timestate: TimeState = {part: 0, total: 0}


        // eslint-disable-next-line
        private interval: any = -1
        private interval_set: boolean = false
        private is_show_menu: boolean = false;
        private showalarm: boolean = false;
        private buffer: BufferData = getBufferData()
        private show_modal: boolean = false;
        private animation: boolean = true;
        private initial_state_received = false

        @cos.State("pref_default_timer_length") pref_default_timer_length!: number
        @cos.State("pref_alarm") pref_alarm!: boolean

        // Is Running
        @cos.State("state_is_running") state_is_running!: boolean
        @cos.Mutation("change_state_is_running") change_state_is_running!: (a: boolean) => void

        // Initial State
        @cos.State("state_initial_state_received") state_initial_state_received!: boolean
        @cos.Mutation("change_state_initial_state_received") change_state_initial_state_received!: (a: boolean) => void

        // Is Timer
        @cos.State("state_is_timer") state_is_timer!: boolean
        @cos.Mutation("change_state_is_timer") change_state_is_timer!: (a: boolean) => void

        @cos.State("pref_after_timer_end") pref_after_timer_end!: string

        // Ring
        @cos.State("pref_ring") pref_ring!: boolean
        @cos.Mutation("change_pref_ring") change_pref_ring!: (a: boolean) => void

        //On Top
        @cos.State("pref_ontop") pref_ontop!: boolean
        @cos.Mutation("change_pref_ontop") change_pref_ontop!: (a: boolean) => void

        //Low Energy
        @cos.State("pref_low_energy") pref_low_energy!: boolean
        @cos.Mutation("change_pref_low_energy") change_pref_low_energy!: (a: boolean) => void


        @cos.State("state_stopwatch_time") state_stopwatch_time!: number
        @cos.State("state_timer_starttime") state_timer_starttime!: number
        @cos.State("state_timer_timeleft") state_timer_timeleft!: number

        @cos.Mutation("change_state_stopwatch_time") change_state_stopwatch_time!: (a: number) => void
        @cos.Mutation("change_state_timer_starttime") change_state_timer_starttime!: (a: number) => void
        @cos.Mutation("change_state_timer_timeleft") change_state_timer_timeleft!: (a: number) => void


        @Watch('pref_ontop')
        pref_ontop_changed(cur: boolean, _old: moment.Moment): void {
            const api = this.$refs['api'] as API
            api.toogleOnTop(cur)
        }


        alarm_toogle_handler(): void {
            this.change_pref_ring(!this.pref_ring)
        }

        get is_electron(): boolean {
            return backend.is_electron();
        }

        get alarm_toggle_icon(): string {
            if (!this.pref_ring) {
                return "disable_ring"
            } else {
                return "enable_ring"
            }
        }

        get alarm_toggle_tooltip(): string {
            if (this.pref_ring) {
                return "Disable Alarm Sound"
            } else {
                return "Enable Alarm Sound"
            }
        }


        get timeDisplayController() {
            return this.state_is_timer ? new TimerControl() : new StopwatchControl()
        }


        commit_preferences(): void {
            // eslint-disable-next-line
            const ref = this.$refs['preferences'] as any
            ref.accept()
        }

        show_ref_modal(name: string): void {
            // eslint-disable-next-line
            const dialog = this.$refs[name] as any;
            dialog.show()
        }

        private check_new_seconds(seconds: number): number {
            const max = 24 * 60 * 60
            let result: number
            if (seconds > max) {
                const msg = "Maximum time is 24 hours";
                this.show_message(msg);
                result = max
            } else {
                result = seconds
            }
            return result
        }

        private show_message(msg: string): void {
            this.eventBus.$emit("showmessage", {text: msg});
        }


        created(): void {
            this.interval = setInterval(() => {
                this.tick()
            }, 1000)
            this.interval_set = true
            this.eventBus.$on("pause", this.pause)
            this.eventBus.$on("menuaction", (ev: MenuAction) => this.handlemenu(ev))
            this.eventBus.$on("TIMERAPI", this.handle_api)
        }


        handle_api(m: ty.TimerIPCMessage) {
            const op = m.op
             if (op == ty.SWITCH) {
                const mm = m as ty.MsgSWITCH
                this.switch_timer_stopwatch()

            } else if (op == ty.PAUSE) {
                const mm = m as ty.MsgPAUSE
                this.pause()

            } else if (op == ty.RESET) {
                const mm = m as ty.MsgRESET
                this.handle_reset()

            } else if (op == ty.PREFERENCES) {
                const mm = m as ty.MsgPREFERENCES

                this.show_ref_modal('preferences_modal')

            } else if (op == ty.ONTOP) {
                const mm = m as ty.MsgONTOP
                const v = mm.val
                this.change_pref_ontop(v)
            } else throw new Error(`OP ${op} is unknown`)

        }


        mounted(): void {
            this.change_state_timer_starttime(this.pref_default_timer_length)
            this.reset()
            const api = this.$refs['api'] as API
            api.request_ipc_state()
            this.tick()

        }

        beforeDestroy(): void {
            if (this.interval_set) {
                clearInterval(this.interval)
            }
        }

        handle_reset(): void {
            this.reset(this.state_is_timer, this.state_is_running)
        }

        reset(is_timer = true, is_running = false) {
            this.change_state_timer_timeleft(this.state_timer_starttime)
            //    this.startTime = this.pref_default_timer_length
            this.change_state_stopwatch_time(0)
            this.change_state_is_running(is_running)
            this.change_state_is_timer(is_timer)
            this.tick(0)
        }

        switch_timer_stopwatch(): void {
            if (this.state_is_timer) {
                if (this.state_stopwatch_time != this.timestate.part) {
                    this.timestate = {total: 60, part: this.state_stopwatch_time}
                }
                this.change_state_is_timer(false)
                this.tick(0)
            } else {
                if (this.timerchanged()) {
                    this.timestate = {total: this.state_timer_starttime, part: this.state_timer_timeleft}
                }
                this.change_state_is_timer(true)
                this.tick(0)
            }
        }

        private timerchanged() {
            return (
                this.timestate.total != this.state_timer_starttime ||
                this.timestate.part != this.state_timer_timeleft
            )
        }

        handlemenu(ev: MenuAction): void {
            if (OPS.OP_INCREASE_TIME == ev.op && ev.value) {
                this.increase_timer(ev.value)
            } else if (OPS.OP_PAUSE == ev.op) {
                this.pause()
            } else if (OPS.OP_SET_TIME == ev.op && ev.value) {
                this.new_timer(ev.value)
            } else if (OPS.OP_START_STOPWATCH == ev.op) {
                this.reset(false, true)
            }
        }

        new_timer(seconds: number): void {
            seconds = this.check_new_seconds(seconds)
            if (this.state_is_timer) {
                this.change_state_timer_starttime(seconds)
                this.change_state_timer_timeleft(seconds)
            } else {
                this.change_state_stopwatch_time(seconds)
            }
            this.buffer = getBufferData()
            this.tick(0)
        }

        increase_timer(seconds: number): void {
            if (this.state_is_timer) {
                const diff = this.state_timer_starttime - this.state_timer_timeleft
                const max_seconds = this.check_new_seconds(seconds + this.state_timer_starttime)
                this.change_state_timer_starttime(Math.max(0, max_seconds))
                this.change_state_timer_timeleft(Math.max(0, max_seconds - diff))
            } else {
                const new_seconds = this.check_new_seconds(seconds + this.state_stopwatch_time)
                this.change_state_stopwatch_time(Math.max(0, new_seconds))
            }
            this.buffer = getBufferData()
            this.tick(0)

        }

        tick(diff: number = 1) {
            this.eventBus.$emit("second_tick")
            this.now = moment()


            if (!this.state_is_running) {
                diff = 0
            }
            if (this.state_is_timer) {
                this.tickaction_timer(diff)
            } else {
                this.tickaction_stopwatch(diff)
            }

            const api = this.$refs['api'] as API
            if (this.state_initial_state_received) {
                api.set_ipc_state()
            }



        }

        tickaction_timer(diff: number) {
            this.change_state_timer_timeleft(this.state_timer_timeleft - diff)
            const ts = {total: this.state_timer_starttime, part: this.state_timer_timeleft}
            this.timestate = ts


            if (this.state_timer_timeleft < 0) {
                this.showalarm = true

                const [is_running, is_timer] = {
                    [PREF_AFTERTIMER.STOP]: [false, true],
                    [PREF_AFTERTIMER.RERUN]: [true, true],
                    [PREF_AFTERTIMER.STOPWATCH]: [true, false],
                }[this.pref_after_timer_end]
                this.reset(is_timer, is_running)
            }
        }

        tickaction_stopwatch(diff: number) {
            this.change_state_stopwatch_time(this.state_stopwatch_time + diff)
            this.timestate = {total: 60, part: this.state_stopwatch_time}
        }

        pause(_?: StringMap) {
            this.change_state_is_running(!this.state_is_running)
        }
    }


</script>




<template>
    <span style="display:none;"></span>
</template>

<script lang="ts">


    import {Component, Vue, Prop, Inject, Watch} from "vue-property-decorator"

    import * as ty from "@/support/timertypes"

    import {namespace} from 'vuex-class'
    import {FullState, TimeState} from "@/support/timertypes";


    import {backend} from "@/api/api_common"


    const cos = namespace('cos')

    @Component
    export default class API extends Vue {
        @Inject() eventBus!: Vue


        @cos.State("pref_default_timer_length") pref_default_timer_length!: number
        @cos.State("pref_alarm") pref_alarm!: boolean
        @cos.State("pref_ring") pref_ring!: boolean
        @cos.State("pref_after_timer_end") pref_after_timer_end!: string
        @cos.State("state_stopwatch_time") state_stopwatch_time!: number
        @cos.State("state_timer_starttime") state_timer_starttime!: number
        @cos.State("state_timer_timeleft") state_timer_timeleft!: number
        @cos.State("pref_ontop") pref_ontop!: boolean
        @cos.State("pref_low_energy") pref_low_energy!: boolean
        @cos.State("state_is_timer") state_is_timer!: boolean
        @cos.State("state_is_running") state_is_running!: boolean

        @cos.Mutation("change_pref_default_timer_length") change_pref_default_timer_length!: (a: number) => void
        @cos.Mutation("change_pref_alarm") change_pref_alarm!: (a: boolean) => void
        @cos.Mutation("change_pref_ring") change_pref_ring!: (a: boolean) => void
        @cos.Mutation("change_pref_after_timer_end") change_pref_after_timer_end!: (a: string) => void
        @cos.Mutation("change_state_stopwatch_time") change_state_stopwatch_time!: (a: number) => void
        @cos.Mutation("change_state_timer_starttime") change_state_timer_starttime!: (a: number) => void
        @cos.Mutation("change_state_timer_timeleft") change_state_timer_timeleft!: (a: number) => void
        @cos.Mutation("change_pref_ontop") change_pref_ontop!: (a: boolean) => void
        @cos.Mutation("change_pref_low_energy") change_pref_low_energy!: (a: boolean) => void
        @cos.Mutation("change_state_is_timer") change_state_is_timer!: (a: boolean) => void
        @cos.Mutation("change_state_is_running") change_state_is_running!: (a: boolean) => void


        // Initial State
        @cos.State("state_initial_state_received") state_initial_state_received!: boolean
        @cos.Mutation("change_state_initial_state_received") change_state_initial_state_received!: (a: boolean) => void


        @Watch('pref_ontop')
        pref_ontop_changed(cur: boolean, _old: any): void {
            this.send_ipc_electron({
                op: ty.VALUECHANGE,
                name: 'pref_ontop',
                val: cur
            })
        }

        //Low Energy


        @Watch('pref_low_energy')
        pref_low_energy_changed(cur: boolean, _old: any): void {
            this.send_ipc_electron({
                op: ty.VALUECHANGE,
                name: 'pref_low_energy',
                val: cur
            })
        }

        // IS TIMER


        @Watch('state_is_timer')
        state_is_timer_changed(cur: boolean, _old: any): void {
            this.send_ipc_electron({
                op: ty.VALUECHANGE,
                name: 'state_is_timer',
                val: cur
            })
        }

        // IS Running


        @Watch('state_is_running')
        state_is_running_changed(cur: boolean, _old: any): void {
            this.send_ipc_electron({
                op: ty.VALUECHANGE,
                name: 'state_is_running',
                val: cur
            })
        }

        created() {
            backend.on('TIMERAPI', (_evt: any, arg: ty.TimerIPCMessage) => {
                this.handle(arg)
            })

            backend.on('TIMERSTATE', (_evt: any, m: ty.TimerIPCMessage) => {
                const pl = m as ty.MsgSTATEREPLY

                if (pl.ok && pl.state != null) {
                    this.set_fullstate(pl.state)
                } else {
                    const MARKER = ""
                }
                this.change_state_initial_state_received(true)
            })
        }





        set_fullstate(fullstate: ty.FullState) {
            this.change_pref_default_timer_length(fullstate.pref_default_timer_length)
            this.change_pref_alarm(fullstate.pref_alarm)
            this.change_pref_ring(fullstate.pref_ring)
            this.change_pref_after_timer_end(fullstate.pref_after_timer_end)
            this.change_state_stopwatch_time(fullstate.state_stopwatch_time)
            this.change_state_timer_starttime(fullstate.state_timer_starttime)
            this.change_state_timer_timeleft(fullstate.state_timer_timeleft)
            this.change_pref_ontop(fullstate.pref_ontop)
            this.change_pref_low_energy(fullstate.pref_low_energy)
            this.change_state_is_timer(fullstate.state_is_timer)
            this.change_state_is_running(fullstate.state_is_running)
        }

        get_fullstate(): ty.FullState {
            return {
                "pref_default_timer_length": this.pref_default_timer_length,
                "pref_alarm": this.pref_alarm,
                "pref_ring": this.pref_ring,
                "pref_after_timer_end": this.pref_after_timer_end,
                "state_stopwatch_time": this.state_stopwatch_time,
                "state_timer_starttime": this.state_timer_starttime,
                "state_timer_timeleft": this.state_timer_timeleft,
                "pref_ontop": this.pref_ontop,
                "pref_low_energy": this.pref_low_energy,
                "state_is_timer": this.state_is_timer,
                "state_is_running": this.state_is_running,
            }
        }

        send_ipc_electron(m: ty.TimerIPCMessage) {
            backend.send("TIMERAPI", m)
        }

        set_ipc_state(): void {
            const state = this.get_fullstate()
            const msg = {op: "STATEPUSH", state}
            backend.send("TIMERSTATE", msg)
        }

        request_ipc_state(): void {
            backend.send("TIMERSTATE", {op: "STATEREQUEST"})
        }

        toogleOnTop(val: boolean): void {
            this.send_ipc_electron({op: "ONTOP", val})
        }

        handle(m: ty.TimerIPCMessage) {
            this.eventBus.$emit("TIMERAPI", m)
        }
    }

</script>




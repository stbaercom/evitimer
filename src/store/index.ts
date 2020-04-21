import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)


import {Module, VuexModule, Mutation} from 'vuex-module-decorators'

import {PREF_AFTERTIMER} from "@/support/constants"
import {FullState} from "@/support/timertypes";

@Module({namespaced: true, name: 'cos'})
class CounterStore extends VuexModule {
    show_preferences: boolean = false;
    pref_default_timer_length: number = 300;
    pref_alarm: boolean = true;
    pref_ring: boolean = true;
    pref_after_timer_end: string = PREF_AFTERTIMER.STOP;
    state_stopwatch_time: number = 0
    state_timer_starttime: number = 300
    state_timer_timeleft: number = 300
    pref_ontop: boolean = false
    pref_low_energy: boolean = false
    state_is_timer: boolean = true
    state_is_running: boolean = false
    state_initial_state_received = false


    @Mutation
    change_state_initial_state_received(val: boolean): void {
        this.state_initial_state_received = val
    }


    @Mutation
    change_state_is_running(val: boolean): void {
        this.state_is_running = val
    }

    @Mutation
    change_state_is_timer(val: boolean): void {
        this.state_is_timer = val
    }


    @Mutation
    change_pref_ontop(val: boolean): void {
        this.pref_ontop = val
    }

    @Mutation
    change_pref_low_energy(val: boolean): void {
        this.pref_low_energy = val
    }


    @Mutation
    change_state_stopwatch_time(val: number): void {
        this.state_stopwatch_time = val
    }

    @Mutation
    change_state_timer_starttime(val: number): void {
        this.state_timer_starttime = val
    }

    @Mutation
    change_state_timer_timeleft(val: number): void {
        this.state_timer_timeleft = val
    }

    @Mutation
    change_pref_default_timer_length(val: number): void {
        this.pref_default_timer_length = val
    }

    @Mutation
    change_pref_alarm(val: boolean): void {
        this.pref_alarm = val
    }

    @Mutation
    change_pref_ring(val: boolean): void {
        this.pref_ring = val
    }

    @Mutation
    change_pref_after_timer_end(val: string): void {
        this.pref_after_timer_end = val
    }

    @Mutation
    change_show_preferences(val: boolean): void {
        this.show_preferences = val
    }
}


const store = new Vuex.Store({
    modules: {
        cos: CounterStore
    }
})

export default store


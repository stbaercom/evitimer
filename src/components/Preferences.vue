<template>
    <div class="preferences">
        <div>
            <div>After Timer ends</div>
            <select v-model="local_pref_after_timer_end">
                <option v-for="v in after_timer_end_options" :key="v">{{v}}</option>
            </select>
        </div>
        <div>
            <div>Default Timer Length</div>
            <div class="slider">
                <input v-model.number="local_pref_default_timer_length"
                       type="range"
                       min="0"
                       max="1800"
                       step="10">
                <span>{{local_pref_default_timer_length}}</span>
            </div>
        </div>
        <div>
            <label for="low_energy">Low Energy Mode</label>
            <input v-model="local_pref_low_energy" class="cb" id="low_energy" name="low_energy" type="checkbox">
        </div>
    </div>
</template>

<script lang="ts">
    import {PREF_AFTERTIMER} from "@/support/constants";
    import {Component, Vue, Inject, Watch} from "vue-property-decorator";
    import {namespace} from 'vuex-class'

    const cos = namespace('cos')

    @Component
    export default class Preferences extends Vue {

        @Inject() eventBus!: Vue
        @Inject() icon_size!: number

        local_pref_default_timer_length: number = 0;
        local_pref_alarm: boolean = false;
        local_pref_ring: boolean = false
        local_pref_low_energy: boolean = false
        local_pref_after_timer_end: string = "";

        @cos.State("pref_default_timer_length") pref_default_timer_length!: number
        @cos.State("pref_alarm") pref_alarm!: boolean
        @cos.State("pref_ring") pref_ring!: boolean
        @cos.State("pref_after_timer_end") pref_after_timer_end!: string
        @cos.State("show_preferences") show_preferences!: boolean

        @cos.Mutation("change_pref_after_timer_end") change_pref_after_timer_end!: (a: string) => void
        @cos.Mutation("change_pref_ring") change_pref_ring!: (a: boolean) => void
        @cos.Mutation("change_pref_alarm") change_pref_alarm!: (a: boolean) => void
        @cos.Mutation("change_pref_default_timer_length") change_pref_default_timer_length!: (a: number) => void
        @cos.Mutation("change_show_preferences") change_show_preferences!: (a: boolean) => void

        //Low Energy
        @cos.State("pref_low_energy") pref_low_energy!: boolean
        @cos.Mutation("change_pref_low_energy") change_pref_low_energy!: (a: boolean) => void




        private load_from_store() {
            this.local_pref_default_timer_length = this.pref_default_timer_length
            this.local_pref_alarm = this.pref_alarm
            this.local_pref_ring = this.pref_ring
            this.local_pref_after_timer_end = this.pref_after_timer_end
            this.local_pref_low_energy = this.pref_low_energy
        }

        shown(): void {
            this.load_from_store();
        }


        @Watch('pref_default_timer_length')
        pref_default_timer_length_changed(cur: number, _old: number): void {
            this.local_pref_default_timer_length = cur
        }

        @Watch('pref_alarm')
        pref_alarm_changed(cur: boolean, _old: boolean): void {
            this.local_pref_alarm = cur
        }

        @Watch('pref_ring')
        pref_ring_changed(cur: boolean, _old: boolean): void {
            this.local_pref_ring = cur
        }

        @Watch('pref_after_timer_end')
        pref_after_timer_end_changed(cur: string, _old: string): void {
            this.local_pref_after_timer_end = cur
        }

        @Watch('pref_low_energy')
        pref_low_energy_changed(cur: boolean, _old: boolean): void {
            this.local_pref_low_energy = cur
        }


        get after_timer_end_options(): string[] {
            return Object.values(PREF_AFTERTIMER)
        }

        accept() {
            this.change_pref_after_timer_end(this.local_pref_after_timer_end)
            this.change_pref_ring(this.local_pref_ring)
            this.change_pref_alarm(this.local_pref_alarm)
            this.change_pref_default_timer_length(this.local_pref_default_timer_length)
            this.change_pref_low_energy(this.local_pref_low_energy)
            this.change_show_preferences(false)
        }

        close() {
            this.change_show_preferences(false)
        }


    }


</script>

<style scoped>
    .preferences {
        font-size: 8pt;
        background-color: white;
        border: 1px black solid;
        border-radius: 5px;
    }

    .preferences > div {
        margin-top: 1em;
        font-size: 12pt;
    }

    .preferences > div:first-child {
        margin-top: 0em;

    }


    .preferences > div label, select {
    }

    .slider {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .slider > span {

    }

    input.cb {
        width: 1.2em;
        height: 1.2em;
        margin-left: 0.3em;
    }

    input {
        margin-right: .5em;
    }


</style>

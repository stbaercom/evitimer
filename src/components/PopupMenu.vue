<template>
    <div class="menu">
        <div v-for="m in menuactions" @click="menudispatch(m)" :key="m.id">{{m.text}}</div>
    </div>

</template>

<script lang="ts">
    import {Component, Vue, Prop, Inject} from "vue-property-decorator"
    import {OPS} from "../support/constants"
    import {namespace} from 'vuex-class'

    type MenuEntry = {
        id: number;
        text: string;
        action: (a: PopupMenue) => void;
    }

    const cos = namespace('cos')

    @Component
    export default class PopupMenue extends Vue {
        @Inject() readonly eventBus!: Vue
        @Prop() readonly hide!: () => void
        @cos.State("pref_default_timer_length") pref_default_timer_length!: number


        menudispatch(m: MenuEntry) {
            m.action(this)
            this.hide()
        }

        get menuactions(): MenuEntry[] {
            return [
                {
                    id: 1,
                    text: `Pause/Resume`,
                    action: (a: PopupMenue) => a.eventBus.$emit("menuaction", {op: OPS.OP_PAUSE})
                },
                {
                    id: 2,
                    text: "Start Default Timer",
                    action: (a: PopupMenue) => a.eventBus.$emit("menuaction", {op: OPS.OP_SET_TIME, value: this.pref_default_timer_length})
                },
                {
                    id: 3,
                    text: "Add 5 Minutes to Timer",
                    action: (a: PopupMenue) => a.eventBus.$emit("menuaction", {op: OPS.OP_INCREASE_TIME, value: 300})
                },
                {
                    id: 4,
                    text: "Start Stopwatch",
                    action: (a: PopupMenue) => a.eventBus.$emit("menuaction", {op: OPS.OP_START_STOPWATCH})
                },
            ]
        }
    }

</script>

<style scoped>
    .menu {
        font-weight: bolder;
        line-height: 18px;
        border: 1px black solid;
        border-radius: 5px;

    }

    .menu > div {
        background-color: white;
        margin: 4px;
        border-radius: 4px;
    }

    .menu > div:hover {
        border: 1px solid black;
    }

    .menu_icon {
        position: absolute;
    }
</style>

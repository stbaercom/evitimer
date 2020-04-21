<template>

    <div class="cell">
        <IconButton
                :size="icon_size"
                :handler="()=> this.change(+1)"
                tooltip="Increase Value"
                iconname="arrow_up"
                :disabled="disabled_up">
        </IconButton>
        <div class="buffer">
            {{fmt_val}}
        </div>
        <IconButton
                :size="icon_size"
                :handler="()=> this.change(-1)"
                tooltip="Decrease Value"
                iconname="arrow_down"
                :disabled="disabled_down">
        </IconButton>

    </div>


</template>

<script lang="ts">

    import {Component, Vue, Inject, Prop} from "vue-property-decorator"

    import IconButton from "@/components/IconButton.vue";

    export interface ChangeEvent {
        idx: number;
        val: number;
    }


    @Component({
        components: {
            IconButton
        }
    })
    export default class BufferCell extends Vue {
        @Inject() readonly eventBus!: Vue
        @Inject() icon_size!: number

        @Prop({required: true}) readonly val!: number
        @Prop({required: true}) readonly idx!: number


        get fmt_val(): string {
            return this.val > 9 ? `${this.val}` : `0${this.val}`
        }

        get disabled_up() {
            return this.val >= 99
        }

        get disabled_down() {
            return this.val <= 0
        }

        private change(diff: number) {
            const newval = this.val + diff
            if (newval > 99 || newval < 0) {
                return
            }

            this.$emit("changed", {idx: this.idx, val: newval})
        }


    }


</script>


<style scoped>

    .cell {
        display: flex;
        flex-direction: column;
    }

</style>

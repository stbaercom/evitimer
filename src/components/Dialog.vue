<template>
    <div class="tmmodal">




        <b-modal ref="modal"
                 :static="true"
                 :id="uid"
                 size="sm"
                 button-size="sm"
                 title="BootstrapVue"
                 v-model="shown"

        >
            <template v-slot:modal-header="{ close }">
                <div class="theader">
                    <div class="spacer"></div>
                    <span class="tlead">
                        {{title}}
                    </span>

                    <IconButton
                            v-if="commit!=undefined"
                            class="ibtn"
                            :size="icon_size"
                            :handler="do_commit"
                            tooltip="Save Changes"
                            iconname="accept">
                    </IconButton>

                    <IconButton
                            class="ibtn"
                            :size="icon_size"
                            :handler="close"
                            tooltip="Close"
                            iconname="close">
                    </IconButton>
                </div>


            </template>

            <template v-slot:default="{visible}">
                <slot :hide="hide" :show="show" :visible="visible"></slot>
            </template>


            <template v-slot:modal-footer="{}">
                <div class="tfooter">
                </div>
            </template>


        </b-modal>
    </div>
</template>

<script lang="ts">
    import IconButton from "@/components/IconButton.vue";
    import {Component, Vue, Inject, Prop} from "vue-property-decorator";


    @Component({
        components: {
            IconButton
        }
    })
    export default class Dialog extends Vue {
        @Inject() eventBus!: Vue
        @Inject() icon_size!: number
        @Prop({required: true}) readonly title!: string
        @Prop() readonly commit!: () => void
        private shown: boolean = false

        do_commit() {
            if (this.commit != undefined) {
                this.commit()
            }
            this.hide()
        }

        get classes() {
            return {
                shown: this.shown,
                notshown: !this.shown
            }
        }

        show() {
            // eslint-disable-next-line
            const m = this.$refs['modal'] as any

            // eslint-disable-next-line
            this.$slots.default?.forEach((n) => {
                const c = n.componentInstance as any
                if (c.shown) {
                    c.shown()
                }
            })
            m.show()
        }

        hide() {
            // eslint-disable-next-line
            const m = this.$refs['modal'] as any
            m.hide()
        }

        get uid(): string {
            return "blubb"
        }
    }
</script>

<style scoped>

    .spacer {
        min-height: 2.2em;
    }

    .tmmodal >>> div.modal-dialog.modal-sm, .tmmodal >>> div.modal-content {
        margin: 0 auto;
        max-width: 200px;
        max-height: 200px;
    }

    .theader, .tfooter {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
        flex-grow: 1;
        line-height: 16px;
        padding: 0;
        margin: 0;
    }

    .tmmodal >>> .modal-header, .tmmodal >>> .modal-footer {
        justify-content: center;
        flex-direction: row;
        font-weight: bold;
        font-size: 1.2em;
    }


    .tmmodal >>> .modal-footer {
        width: 0;
        height: 0;
        padding: 0;
        margin: 0;
    }


    .tmmodal >>> div.modal-content header.modal-header {
        padding: 0.2em 0.1em 0.3em 0.3em;
    }


    .tmmodal >>> .modal-body {
        padding: 0.2em 0.1em 0.3em 0.3em;
        max-height: 100%;
        overflow: scroll;

    }


    .tmmodal >>> .modal-header .btn, .tmmodal >>> .modal-footer .btn {
        line-height: 1;

    }


    .tlead {
        flex-grow: 1;
    }

    .ibtn {
        margin: 0 5px;
    }


</style>



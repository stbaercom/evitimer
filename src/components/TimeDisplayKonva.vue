<template>
    <div>
        <v-stage :config="configKonva" ref="konva">
        </v-stage>
        <TimeLabel :time="timestate.part"
                   :controller="controller"
                   :now="now"
                   :size="size">

        </TimeLabel>
    </div>
</template>

<script lang="ts">

    const ARC_INNER_RAD = 75
    const ARC_OUTER_RAD = 90
    const MARK_CIRCLE_RAD = (ARC_INNER_RAD + ARC_OUTER_RAD) / 2
    const MARK_CIRCLE_DIA = (ARC_OUTER_RAD - ARC_INNER_RAD) / 1.5

    import moment from 'moment';


    import TimeLabel from "@/components/TimeLabel.vue";
    import {NumberMap, TimeState} from "@/support/timertypes";
    import {Component, Vue, Prop, Watch} from "vue-property-decorator";
    import {TimeControlInterface} from "@/support/displaycontroller";
    import Konva from "konva";

    import {namespace} from 'vuex-class'
    const cos = namespace('cos')



    interface Pos {
        x: number;
        y: number;
        ang: number;
        rad: number;
    }




    @Component({
        components: {
            TimeLabel
        }
    })
    export default class TimeDisplayKonva extends Vue {
        @Prop() readonly timestate!: TimeState
        @Prop() readonly size!: number
        @Prop() readonly controller!: TimeControlInterface
        @Prop() readonly now!: moment.Moment

        @cos.State("pref_low_energy") pref_low_energy!: boolean

        private layer: Konva.Layer | undefined = undefined
        private arc: Konva.Arc | undefined = undefined
        private mark_circle: Konva.Circle | undefined = undefined
        private skip_total: boolean = false
        private skip_part: boolean = false

        get configKonva(): NumberMap {
            return {
                width: this.size,
                height: this.size
            }
        }

        @Watch('timestate')
        timestateChanged(cur: TimeState, old: TimeState): void {
            const low_en = this.pref_low_energy
            const animate = (cur.total == old.total) && (cur.total != cur.part) && !low_en
            this.update(animate)
        }


        mounted() {
            const fraction = this.timestate.part / this.timestate.total || 0

            // eslint-disable-next-line
            const ref = this.$refs.konva as any
            const stage = ref.getStage()


            const img_layer = new Konva.Layer()
            stage.add(img_layer)

            const layer = new Konva.Layer()
            this.layer = layer



            const imgs = require.context("@/assets/images", false, /\.png$/)
            const imageURL = imgs("./background.png")
            Konva.Image.fromURL(imageURL, function(image: Konva.Image){
                image.setAttrs({
                    scaleX: 0.5,
                    scaleY: 0.5,
                })

                img_layer.add(image);
                img_layer.batchDraw();
            });
            img_layer.draw()

            this.layer = layer



            const arc = new Konva.Arc({
                clockwise: false,
                x: stage.width() / 2,
                y: stage.height() / 2,
                innerRadius: ARC_INNER_RAD,
                outerRadius: ARC_OUTER_RAD,
                rotation: -90,
                angle: 360 * fraction,
                fill: this.controller.displayColor(this.timestate.part, this.timestate.total),
                stroke: 'black',
                strokeWidth: 0,
                shadowColor: 'black',
                shadowBlur: 130,
                shadowOffset: {x: 0, y: 0},
                shadowOpacity: 0.5
            });

            this.arc = arc
            layer.add(arc);


            this.setupMarkCircle();


            stage.add(layer);
            layer.draw();
        }

        private setupMarkCircle(): void {
            const local_call = (pos: Konva.Vector2d) => {
                const r2d = Math.PI / 180
                const yd = pos.y - MARK_CIRCLE_RAD - this.size / 2
                const xd = pos.x - this.size / 2
                const tan = yd / xd
                const _angle = Math.atan(tan) * r2d
                // TODO: Implement drag
            }

            const circle = new Konva.Circle({
                x: this.size / 2,
                y: this.size / 2,
                radius: MARK_CIRCLE_DIA,
                offsetX: -MARK_CIRCLE_RAD,
                offsetY: 0,
                stroke: "black",
                strokeWidth: 0,
              //  draggable: true,
                dragBoundFunc: function (pos) {
                    local_call(pos)

                    return {
                        x: pos.x,
                        y: pos.y
                    };
                }
            });

            if (this.mark_circle) {
                this.mark_circle.destroy()
            }

            this.mark_circle = circle
            this.update(false)
            this.layer?.add(circle)
        }

        private update(animate: boolean) {


            const layer: Konva.Layer = this.layer as Konva.Layer
            const arc: Konva.Arc = this.arc as Konva.Arc
            const mark_circle = this.mark_circle as Konva.Circle
            const part = this.timestate.part
            const total = this.timestate.total

            const color = this.controller.displayColor(part, total);
            const rotation = this.controller.rotation(part, total);

            //const mark_circle_pos = get_marker_circle_pos(rotation, MARK_CIRCLE_RAD)

            const dst_arc = {
                'fill': color,
                'angle': this.controller.angle(part, total),
                'rotation': rotation
            }

            const dst_marked_circle = {
                'fill': color,
                'rotation': rotation
            }


            if (animate) {
                const tween_arc = new Konva.Tween({
                    node: arc,
                    duration: .9,
                    ...dst_arc
                })
                tween_arc.play()

                const tween_mc = new Konva.Tween({
                    node: mark_circle,
                    duration: .9,
                    ...dst_marked_circle
                })
                tween_mc.play()


            } else {
                arc.setAttrs(dst_arc)
                mark_circle.setAttrs(dst_marked_circle)
            }
            layer.draw();
        }

    }
</script>




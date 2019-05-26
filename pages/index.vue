<template lang='pug'>
  v-layout.justify-center
    v-flex.xs12
      v-card#editor.fill-height(v-resize='calcStageSize')
        v-card-title.py-1.title.grey.white--text.font-weight-thin
          | Viete.io
          | from [ {{ dragStart.x }}, {{ dragStart.y }} ] to [ {{ dragEnd.x }}, {{ dragEnd.y }} ]
          v-spacer
          v-chip(dark small) {{ scaleConfig.scaleX.toFixed(2) }} * {{ scaleConfig.scaleY.toFixed(2) }}
          v-spacer
          v-btn(icon small @click='scaleIn')
            v-icon.mdi-24px(color='white') mdi-magnify-plus-outline
          v-btn(icon small @click='scaleReset')
            v-icon.mdi-24px(color='white') mdi-magnify-close
          v-btn(icon small @click='scaleOut')
            v-icon.mdi-24px(color='white') mdi-magnify-minus-outline

        v-card-text.pa-0
          v-stage.bordered(ref='stage' :config='stageConfig')
            v-layer(ref='layer' :config='{...scaleConfig}')
              v-circle(
                :config='circleConfig'
                @mouseenter='handleMouseEnter'
                @mouseleave='handleMouseLeave'
                @dragstart='handleDragStart'
                @dragend='handleDragEnd'
              )
              UseCase
            v-layer(ref='dragLayer')
</template>

<script lang='ts'>
import Konva from 'konva'
import { Component, Vue } from 'vue-property-decorator'
import LayerScaleMixin from '~/mixins/scale-config'
import ScaleConfigMixin from '~/mixins/cursor-pointer'
import IPosition from '~/models/Position'

let vm: any = {}

@Component({
  components: {
    UseCase: () => import('~/components/UseCase.vue')
  },
  mixins: [LayerScaleMixin, ScaleConfigMixin]
})
export default class IndexPage extends Vue {
  dragStart: IPosition = {
    x: 0,
    y: 0
  }
  dragEnd: IPosition = {
    x: 0,
    y: 0
  }
  stageConfig: any = {
    width: 10,
    height: 10,
    draggable: true
  }
  circleConfig: any = {
    x: 35,
    y: 35,
    radius: 35,
    fill: '#00C081',
    stroke: '#1789C3',
    strokeWidth: 5,
    opacity: 0.75,
    draggable: true,
    dragBoundFunc: function (pos) {
      const stage = vm.$refs.stage.getStage()
      const x1 = 0 + this.width() / 2
      const y1 = 0 + this.height() / 2
      const x2 = stage.width() - this.width() / 2
      const y2 = stage.height() - this.height() / 2
      const x = (pos.x < x1) ? x1 : (pos.x > x2 ? x2 : pos.x)
      const y = (pos.y < y1) ? y1 : (pos.y > y2 ? y2 : pos.y)
      return { x: x, y: y }
    }
  }

  created() {
    vm = this
  }

  calcStageSize(): void {
    const editor = document.getElementById('editor')
    const { clientWidth, clientHeight } = editor as any // TODO!
    this.stageConfig.width = clientWidth
    this.stageConfig.height = clientHeight - 74
  }

  handleDragStart(e): void {
    const shape = e.target
    const dragLayer = this.$refs.dragLayer.getNode()
    const stage = this.$refs.stage.getStage()

    // moving to another layer will improve dragging performance
    shape.moveTo(dragLayer)
    stage.draw()

    shape.setAttrs({
      shadowOffsetX: 15,
      shadowOffsetY: 15,
      scaleX: shape.getAttr('scaleX') * 1.2,
      scaleY: shape.getAttr('scaleY') * 1.2
    })

    this.dragStart.x = shape.attrs.x.toFixed()
    this.dragStart.y = shape.attrs.y.toFixed()
  }

  handleDragEnd(e): void {
    const shape = e.target
    const layer = this.$refs.layer.getNode()
    const stage = this.$refs.stage.getStage()

    // move back to the main layer
    shape.moveTo(layer)
    stage.draw()

    shape.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: shape.getAttr('scaleX') / 1.2,
      scaleY: shape.getAttr('scaleY') / 1.2,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    })

    this.dragEnd.x = shape.attrs.x.toFixed()
    this.dragEnd.y = shape.attrs.y.toFixed()
  }
}
</script>

<style lang="stylus" scoped>
 .bordered
    border 1px dashed grey
</style>

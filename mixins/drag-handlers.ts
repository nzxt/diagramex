import Konva from 'konva'

import { Component, Vue } from 'vue-property-decorator'
import IPosition from '~/models/Position'

@Component
export default class DragHandlersMixin extends Vue {
  dragStart: IPosition = {
    x: 0,
    y: 0
  }
  dragEnd: IPosition = {
    x: 0,
    y: 0
  }
  handleDragStart(evt): void {
    const shape = evt.target
    const dragLayer = this.$refs.dragLayer.getNode()
    const stage = this.$refs.stage.getStage()

    // moving to another layer will improve dragging performance
    shape.moveTo(dragLayer)
    stage.draw()

    shape.setAttrs({
      shadowOffsetX: 15,
      shadowOffsetY: 15,
      scaleX: shape.getAttr('scaleX') * 1.1,
      scaleY: shape.getAttr('scaleY') * 1.1
    })

    this.dragStart.x = shape.attrs.x.toFixed()
    this.dragStart.y = shape.attrs.y.toFixed()
  }

  handleDragEnd(evt): void {
    const shape = evt.target
    const layer = this.$refs.layer.getNode()
    const stage = this.$refs.stage.getStage()

    // move back to the main layer
    shape.moveTo(layer)
    stage.draw()

    shape.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1, // shape.getAttr('scaleX') / 1.2,
      scaleY: 1, // shape.getAttr('scaleY') / 1.2,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    })

    this.dragEnd.x = shape.attrs.x.toFixed()
    this.dragEnd.y = shape.attrs.y.toFixed()
  }
}

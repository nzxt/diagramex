<template lang="pug">
  //- v-label(
  //-   :name='variable.id'
  //-   :config='labelConfig'
  //-   @dragstart='handleDragStart'
  //-   @dragend='handleDragEnd'
  //- )
  //-   v-tag(:config="tagConfig")
  //-   v-text(:confit="tagTextConfig")

  v-group(
    :name='variable.id'
    :config='{x: this.variable.position.x, y: this.variable.position.y, ...groupConfig}'
    @dragmove='handleDragMove'
    @dragstart='handleDragStart'
    @dragend='handleDragEnd'
  )
    v-rect(:config='{...bodyConfig, fill: isDragging ? "#B2DFDB" : "#fff"}')
    v-text(:config='{...textConfig, fill: isDragging ? "#546E7A" : "#757575"}')
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IVariable } from '~/models/interfaces'

@Component({})
export default class Variable extends Vue {
  @Prop({ default: '' })
  ucId!: string
  // @Prop({ default: {} })
  // ucRef!: any
  @Prop({ default: {} })
  variable!: IVariable

  isDragging: Boolean = false

  groupConfig: any = {
    // x: this.variable.position.x,
    // y: this.variable.position.y,
    draggable: true
  }
  textConfig: any = {
    text: this.variable.identifier,
    fontFamily: 'Calibri',
    fontSize: 16,
    padding: 10
  }
  bodyConfig: any = {
    width: 135,
    height: 35,
    stroke: '#01579B',
    strokeWidth: 0.5,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: 10,
    shadowOpacity: 0.5,
    cornerRadius: 3
  }

  /* eslint-disable */

  resizeUseCase(evt): void {
    const stage = window.$stage
    const layer = window.$layer
    const useCase = layer.findOne(`.${this.ucId}`)
    const ucBody = useCase.findOne(`.useCaseBody`)

    const x1 = useCase.x()
    const y1 = useCase.y() + ucBody.y()
    const height = ucBody.height()
    const width = ucBody.width()
    const x2 = x1 + width
    const y2 = y1 + height

    const { x, y } = evt.evt

    if (x > x2)
      ucBody.width(width + x-x2)
    // else (x < x1)
    //   useCase.x(x)
    if (y > y2)
      ucBody.height(height + y-y2)
    // else (y < y1)
    //   useCase.y(y)

    stage.draw()
  }

  handleDragMove(evt): void {
    this.resizeUseCase(evt)
  }

  handleDragStart(evt): void {
    this.isDragging = true
    // const shape = evt.target
    // const stage = window.$stage
    // const dragLayer = window.$dragLayer
    // // // const layer = window.$layer
    // shape.moveTo(dragLayer)
    // stage.draw()
  }
  handleDragEnd(evt): void {
    this.isDragging = false
    // this.resizeUseCase(evt)
    // const shape = evt.target
    // const stage = window.$stage
    // const layer = window.$layer
    // const group = layer.findOne(`.${this.ucId}`)
    // // const group = this.ucRef.getNode()
    // shape.moveTo(layer)
    // shape.moveTo(group)
    // // group.add(shape)
    // stage.draw()
    evt.cancelBubble = true
  }
}
</script>

  // labelConfig: any = {
  //   x: 15,
  //   y: 15,
  //   opacity: 0.75,
  //   draggable: true
  // }

  // tagConfig: any = {
  //   width: 150,
  //   height: 50,
  //   fill: 'lightGrey',
  //   shadowColor: 'black',
  //   shadowBlur: 10,
  //   shadowOffset: 10,
  //   shadowOpacity: 0.2
  // }

  // tagTextConfig: any = {
  //   width: 150,
  //   height: 50,
  //   text: 'Tooltip pointing down',
  //   fontFamily: 'Calibri',
  //   fontSize: 18,
  //   padding: 5,
  //   fill: 'white'
  // }

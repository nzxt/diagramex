<template lang="pug">
  v-group(
    ref='useCase'
    :name='useCase.id'
    :config='{x: useCase.position.x, y: useCase.position.y, ...groupConfig}'
    @dragmove='handleDragMove'
    @dragstart='emitDragStart'
    @dragend='handleDragEnd'
    @mouseenter='emitMouseEnter'
    @mouseleave='emitMouseLeave'
  )
    v-rect(:config='titleConfig')
    v-text(:config='textConfig')
    v-rect(:config='{width: 420, height: 230, ...bodyConfig}')
    Variable(
      v-for='item in useCase.variables'
      :key='item.id'
      :ucId='useCase.id'
      :variable='item'
    )
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

import { IUseCase } from '~/models/interfaces'

@Component({
  components: {
    Variable: () => import('~/components/Variable.vue')
  }
})
export default class UseCase extends Vue {
  @Prop({ default: {} })
  useCase!: IUseCase

  @Mutation('updateUCPosition') mutationUpdateUCPosition

  groupConfig: any = {
    // x: this.useCase.position.x,
    // y: this.useCase.position.y,
    draggable: true
  }
  textConfig: any = {
    x: 0,
    y: 0,
    text: this.useCase.identifier,
    fontSize: 14,
    fontFamily: 'Consolas',
    fill: '#fff',
    // width: 100,
    padding: 10,
    align: 'left'
  }
  titleConfig: any = {
    x: 0,
    y: 0,
    stroke: '#01579B',
    strokeWidth: 0.5,
    fill: '#01579B',
    width: 300,
    height: 40,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: [10, 10],
    shadowOpacity: 0.2,
    cornerRadius: 5,
    opacity: 0.5
  }
  bodyConfig: any = {
    name: 'useCaseBody',
    x: 0,
    y: 30,
    // width: 400,
    // height: 200,
    stroke: '#01579B',
    strokeWidth: 0.5,
    fill: '#E1F5FE',
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: [10, 10],
    shadowOpacity: 0.2,
    cornerRadius: 5
    // opacity: 0.5
  }

  /* eslint-disable */
  resizeUseCase(evt): void {
    const stage = window.$stage
    // const layer = window.$layer
    // const useCase = layer.findOne(`.${this.ucId}`)
    // const ucBody = useCase.findOne(`.useCaseBody`)

    // const x1 = useCase.x()
    // const y1 = useCase.y() + ucBody.y()
    // const height = ucBody.height()
    // const width = ucBody.width()
    // const x2 = x1 + width
    // const y2 = y1 + height

    // const { x, y } = evt.evt

    // if (x > x2)
    //   ucBody.width(width + x-x2)
    // else (x < x1)
    //   useCase.x(x)
    // if (y > y2)
    //   ucBody.height(height + y-y2)
    // else (y < y1)
    //   useCase.y(y)

    const useCase = this.$refs.useCase.getNode()
    const groups = useCase.getChildren(node => node.getClassName() === 'Group')


    groups.forEach(g => {
      const {x, y, width, height} = g.attrs
      debugger
    })

    stage.draw()
  }

  handleDragMove(evt) {
    // this.resizeUseCase(evt)
  }

  handleDragEnd(evt) {
    this.emitDragEnd(evt)
    this.mutationUpdateUCPosition({
      id: this.useCase.id,
      position: {
        x: evt.target.attrs.x,
        y: evt.target.attrs.y
      }
    })
  }

  emitMouseEnter(evt) {
    this.$emit('uc::mouseenter', evt)
  }
  emitMouseLeave(evt) {
    this.$emit('uc::mouseleave', evt)
  }
  emitDragStart(evt) {
    this.$emit('uc::dragstart', evt)
  }
  emitDragEnd(evt) {
    this.$emit('uc::dragend', evt)
  }
}
</script>

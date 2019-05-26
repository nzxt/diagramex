<template lang="pug">
  v-group(
    :id='`usecase-${useCase.id}`'
    :config='{ ...groupConfig, ...scaleConfig }'
    @dragstart='emitDragStart'
    @dragend='emitDragEnd'
    @mouseenter='emitMouseEnter'
    @mouseleave='emitMouseLeave'
  )
    v-rect(:config='titleConfig')
    v-text(:config='textConfig')
    v-rect(:config='bodyConfig')
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

import LayerScaleMixin from '~/mixins/scale-config'

@Component({
  mixins: [LayerScaleMixin]
})
export default class UseCase extends Vue {
  @Prop({ default: {} })
  useCase!: any // IUseCase

  groupConfig: any = {
    x: this.useCase.position.x,
    y: this.useCase.position.y,
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
    stroke: '#555',
    strokeWidth: 3,
    fill: '#2BC30A',
    width: 300,
    height: 35,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: [10, 10],
    shadowOpacity: 0.2,
    cornerRadius: 5,
    opacity: 0.65
  }
  bodyConfig: any = {
    x: 0,
    y: 30,
    stroke: '#555',
    strokeWidth: 3,
    fill: '#6FBAE6',
    width: 400,
    height: 200,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: [10, 10],
    shadowOpacity: 0.2,
    cornerRadius: 5
    // opacity: 0.75,
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

<style lang="stylus" scoped>

</style>

<template lang="pug">
  g.usecase(
    :id='`uc-${useCase.id}`'
    :transform='`translate(${useCase.position.x},${useCase.position.y})`'
  )
    text.uc-pos(
      :x='identifierWidth + 10'
      y='18'
      fill='#ccc'
      font-size="12px"
    ) x:{{ useCase.position.x }} y:{{ useCase.position.y }}
    rect.uc-title(
      x='0'
      y='0'
      :width='identifierWidth'
      height='35'
      rx='5'
      ry='5'
      :style='UCTitleStyle'
    )
    rect.uc-body(
      x='0'
      y='27'
      :width='450'
      :height='250'
      rx='5'
      ry='5'
      :style='UCBodyStyle'
    )
    text.uc-text(
      x='5'
      y='18'
      :style='UCTextStyle'
    ) {{ useCase.identifier }}
    Variable(
      v-for='item in useCase.variables'
      :key='item.id'
      :variable='item'
    )
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

import { IUseCase } from '~/models/interfaces'
import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({
  components: {
    Variable: () => import('~/components/Variable.vue')
  }
})
export default class UseCaseComponent extends Vue {
  @Prop({
    default: () => {},
    type: Object as () => IUseCase
  })
  readonly useCase!: IUseCase

  identifierWidth: number = 150

  UCTitleStyle: any = {
    fill: '#03A9F4',
    stroke: '#01579B',
    strokeWidth: 1
    // opacity: 0.5
  }
  UCTextStyle: any = {
    fill: '#FAFAFA',
    fontSize: '14px'
  }
  UCBodyStyle: any = {
    fill: '#81D4FA',
    stroke: '#01579B',
    strokeWidth: 1
    // opacity: 0.75
  }

  mounted() {
    const uc = this.$snap.select(`#uc-${this.useCase.id}`)
    uc.drag(onMove, onStart, onEnd)
  }

  @Watch('useCase.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string) {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#uc-${this.useCase.id} .uc-text`)
      const bb = text.getBBox()
      this.identifierWidth = bb.width + 10
    })
  }
}
</script>

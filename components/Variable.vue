<template lang="pug">
  g(
    :id='`vr-${variable.id}`'
    :transform='`translate(${variable.position.x},${variable.position.y})`'
  )
    rect.vr-body(
      x='0'
      y='0'
      :width='identifierWidth'
      height='25'
      rx='5'
      ry='5'
      :style='VRBodyStyle'
    )
    text.vr-text(
      x='5'
      y='17'
      :style='VRTextStyle'
    ) {{ variable.identifier }}
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { IVariable } from '~/models/interfaces'
import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({})
export default class VariableComponent extends Vue {
  @Prop({
    default: () => {},
    type: Object as () => IVariable
  })
  readonly variable!: IVariable

  identifierWidth: number = 150

  VRTextStyle: any = {
    fill: '#FAFAFA',
    fontSize: '14px'
  }
  VRBodyStyle: any = {
    fill: '#4CAF50',
    stroke: '#1B5E20',
    strokeWidth: 1,
    opacity: 0.75
  }

  mounted() {
    const vr = this.$snap.select(`#vr-${this.variable.id}`)
    vr.drag(onMove, onStart, onEnd)
  }

  @Watch('variable.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string) {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#vr-${this.variable.id} .vr-text`)
      const bb = text.getBBox()
      this.identifierWidth = bb.width + 10
    })
  }
}
</script>

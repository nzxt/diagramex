<template lang="pug">
  g.variable(
    :id='`vr-${variable.id}`'
    :transform='`translate(${variable.position.x},${variable.position.y})`'
  )
    text.vr-pos(
      :x='identifierWidth - 52'
      y='35'
      fill='#777'
      font-size="10px"
    ) x:{{ variable.position.x.toFixed() }} y:{{ variable.position.y.toFixed() }}
    rect.vr-body(
      x='0'
      y='0'
      :width='identifierWidth'
      height='24'
      rx='5'
      ry='5'
      :style='VRBodyStyle'
    )
    foreignObject.vr-text(
      x="5"
      y="0"
      :width='identifierLength'
      height="22"
    )
      v-text-field.pa-0.ma-0(
        dark
        height='24'
        hide-details
        single-line
        :rules='textRule'
        @input='updateIdentifier'
        v-model='variable.identifier'
      )
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { IVariable } from '~/models/interfaces'
import { onMove, onStart, onEnd } from '~/mixins/draggable'
import { UseCase } from '../models/UseCase'

@Component({})
export default class VariableComponent extends Vue {
  @Mutation('updateVRIdentifier') mutationUpdateVRIdentifier
  @Prop({
    default: () => {},
    type: Object as () => IVariable
  })
  readonly variable!: IVariable

  identifierWidth: number = 150
  identifierLength: number = 50
  useCaseId: string = ''

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

  textRule: Array<any> = [ (value) => {
    const pattern = /^[a-zA-Z][a-zA-Z0-9_]+$/
    return pattern.test(value) || 'Invalid range'
  }
  ]

  /* eslint-disable */
  mounted() {
    const vr = this.$snap.select(`#vr-${this.variable.id}`)
    this.useCaseId = vr.parent().parent().node.id.substring(3)
    vr.drag(onMove, onStart, onEnd)
  }
  /* eslint-enable */

  @Watch('variable.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string) {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#vr-${this.variable.id} .vr-text`)
      const bb = text.getBBox()
      this.identifierWidth = value.length * 8 + 10
      this.identifierLength = value.length * 8 + 2
    })
  }

  updateIdentifier(identifier) {
    this.mutationUpdateVRIdentifier({ useCaseId: this.useCaseId, id: this.variable.id, identifier })
    this.$bus.$emit('IdentifierUpdated', this.useCaseId)
  }
}
</script>

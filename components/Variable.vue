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
    text.vr-text(
      x='0'
      y='17'
      :style='VRTextStyle'
    ) {{ variable.identifier }}
    rect.vr-body(
      x='0'
      y='0'
      :width='identifierWidth+10'
      height='24'
      rx='5'
      ry='5'
      :style='VRBodyStyle'
    )
    foreignObject(
      x="5"
      y="0"
      :width='identifierWidth'
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
        browser-autocomplete='off'
      )
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

import { IVariable } from '~/models/interfaces'

import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({})
export default class VariableComponent extends Vue {
  @Mutation('updateVRIdentifier') mutationUpdateVRIdentifier

  @Prop({
    default: '',
    type: String
  })
  readonly useCaseId!: string

  @Prop({
    default: () => {},
    type: Object as () => IVariable
  })
  readonly variable!: IVariable

  identifierWidth: number = 150

  VRTextStyle: any = {
    fill: 'transparent',
    fontSize: '16px'
  }

  VRBodyStyle: any = {
    fill: '#4CAF50',
    stroke: '#43A047',
    strokeWidth: 1,
    opacity: 0.75
  }

  textRule: Array<any> = [
    (value) => {
      const pattern = /^[a-zA-Z][a-zA-Z0-9_]+$/
      return pattern.test(value) || 'Invalid range'
    }
  ]

  mounted() {
    const variable = this.$snap.select(`#vr-${this.variable.id}`)
    variable.drag(onMove, onStart, onEnd)
  }

  @Watch('variable.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string) {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#vr-${this.variable.id} .vr-text`)
      const textBBox = text.getBBox()
      this.identifierWidth = textBBox.width

      this.$bus.$emit('MovingElement', this.variable.id)
      this.$bus.$emit('MovingChildElement', this.useCaseId)
    })
  }

  updateIdentifier(identifier) {
    this.mutationUpdateVRIdentifier({ useCaseId: this.useCaseId, id: this.variable.id, identifier })
  }
}
</script>

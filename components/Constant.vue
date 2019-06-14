<template lang="pug">
  g.constant(
    :id='`ct-${constant.id}`'
    :transform='`translate(${constant.position.x}, ${constant.position.y})`'
  )
    text.ct-pos(
      :x='identifierWidth - 52'
      y='35'
      fill='#555'
      font-size="10px"
    ) x:{{ constant.position.y.toFixed() }} y:{{ constant.position.y.toFixed()}}
    text.ct-text(
      x='0'
      y='17'
      :style='CTTextStyle'
    ) {{ constant.identifier }}
    rect.ct-body(
      x='0'
      y='0'
      :width='identifierWidth+10'
      height='25'
      rx='5'
      ry='5'
      :style='CTBodyStyle'
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
        color='white'
        hide-details
        single-line
        @input='updateIdentifier'
        v-model='constant.identifier'
        browser-autocomplete='off'
      )
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

import { IConstant } from '~/models/interfaces'

import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({})
export default class ConstantComponent extends Vue {
  @Mutation('updateCTIdentifier') mutationUpdateCTIdentifier
  @Prop({
    default: '',
    type: String
  })
  readonly useCaseId!: string

  @Prop({
    default: () => {},
    type: Object as () => IConstant
  })
  readonly constant!: IConstant

  identifierWidth: number = 150

  CTTextStyle: any = {
    fill: 'transparent',
    fontSize: '16px'
  }

  CTBodyStyle: any = {
    fill: '#00B8D4',
    stroke: '#26C6DA',
    strokeWidth: 1,
    opacity: 0.75
  }

  mounted() {
    const constant = this.$snap.select(`#ct-${this.constant.id}`)
    constant.drag(onMove, onStart, onEnd)
  }

  @Watch('constant.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string) {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#ct-${this.constant.id} .ct-text`)
      const textBBox = text.getBBox()
      this.identifierWidth = textBBox.width

      this.$bus.$emit('MovingElement', this.constant.id)
    })
  }

  updateIdentifier(identifier) {
    this.mutationUpdateCTIdentifier({ useCaseId: this.useCaseId, id: this.constant.id, identifier })
    this.$bus.$emit('IdentifierUpdated', this.useCaseId)
  }
}
</script>

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
    rect.ct-body(
      x='0'
      y='0'
      :width='identifierWidth'
      height='25'
      rx='5'
      ry='5'
      :style='CTBodyStyle'
    )
    foreignObject.ct-text(
      x="5"
      y="3"
      :width='identifierLength'
      height="30"
    )
      v-text-field.pa-0.ma-0(
        dark
        height='24'
        color='white'
        hide-details
        single-line
        :rules='textRule'
        @input='updateIdentifier'
        v-model='constant.identifier'
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
    default: () => {},
    type: Object as () => IConstant
  })
  readonly constant!: IConstant

  identifierWidth: number = 150
  identifierLength: number = 50
  useCaseId: string = ''

  CTTextStyle: any = {
    fill: '#FAFAFA',
    fontSize: '14px'
  }
  CTBodyStyle: any = {
    fill: '#9E9D24',
    stroke: '#827717',
    strokeWidth: 1,
    opacity: 0.75
  }

  textRule: Array<any> = [ (value) => {
    const pattern = /^[a-zA-Z][a-zA-Z0-9_]+$/
    return pattern.test(value) || 'Invalid e-mail.'
  }
  ]

  /* eslint-disable */
  mounted() {
    const ct = this.$snap.select(`#ct-${this.constant.id}`)
    this.useCaseId = ct.parent().parent().node.id.substring(3)
    ct.drag(onMove, onStart, onEnd)
  }
  /* eslint-enable */

  @Watch('constant.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string) {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#ct-${this.constant.id} .ct-text`)
      const bb = text.getBBox()
      this.identifierWidth = value.length * 8 + 10
      this.identifierLength = value.length * 8 + 2
    })
  }

  updateIdentifier(identifier) {
    this.mutationUpdateCTIdentifier({ useCaseId: this.useCaseId, id: this.constant.id, identifier })
  }
}
</script>

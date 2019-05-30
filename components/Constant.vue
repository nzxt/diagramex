<template lang="pug">
  g.constant(
    :id='`cn-${constant.id}`'
    :transform='`translate(${constant.position.x}, ${constant.position.y})`'
  )
    text.cn-pos(
      :x='identifierWidth - 20'
      y='35'
      fill='#555'
      font-size="10px"
    ) x:{{ constant.position.y.toFixed() }} y:{{ constant.position.y.toFixed()}}
    rect.cn-body(
      x='0'
      y='0'
      :width='identifierWidth'
      height='25'
      rx='5'
      ry='5'
      :style='CNBodyStyle'
    )
    text.cn-text(
      x='5'
      y='17'
      :style='CNTextStyle'
    ) {{ constant.identifier }}
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { IConstant } from '~/models/interfaces'
import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({})
export default class ConstantComponent extends Vue {
  @Prop({
    default: () => {},
    type: Object as () => IConstant
  })
  readonly constant!: IConstant

  identifierWidth: number = 150

  CNTextStyle: any = {
    fill: '#FAFAFA',
    fontSize: '14px'
  }
  CNBodyStyle: any = {
    fill: '#9E9D24',
    stroke: '#827717',
    strokeWidth: 1,
    opacity: 0.75
  }

  /* eslint-disable */
  mounted() {
    const vr = this.$snap.select(`#cn-${this.constant.id}`)
    vr.drag(onMove, onStart, onEnd)
  }
  /* eslint-enable */

  @Watch('constant.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string) {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#cn-${this.constant.id} .cn-text`)
      const bb = text.getBBox()
      this.identifierWidth = bb.width + 10
    })
  }
}
</script>

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
    ) x:{{ useCase.position.x.toFixed() }} y:{{ useCase.position.y.toFixed() }}
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
      width='100'
      height='50'
      rx='5'
      ry='5'
      :style='UCBodyStyle'
    )
    //- text.uc-text(
    //-   x='5'
    //-   y='18'
    //-   :style='UCTextStyle'
    //- ) {{ useCase.identifier }}
    foreignObject.uc-text(x="5" y="3" :width='identifierLength' height="30")
      v-text-field.pa-0.ma-0(
        :id="useCase.id"
        dark
        height='24'
        color='white'
        single-line
        :rules='textRule'
        @input='updateIdentifier'
        v-model='useCase.identifier'
      )
    g.uc-body-box
      Variable(
        v-for='item in useCase.variables'
        :key='item.id'
        :variable='item'
      )
      Constant(
        v-for='item in useCase.constants'
        :key='item.id'
        :constant='item'
      )
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

import { IUseCase } from '~/models/interfaces'
import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({
  components: {
    Variable: () => import('~/components/Variable.vue'),
    Constant: () => import('~/components/Constant.vue')
  }
})
export default class UseCaseComponent extends Vue {
  @Mutation('resizeUC') mutationResizeUC
  @Mutation('updateUCIdent') mutationUpdateUCIdent
  @Prop({
    default: () => {},
    type: Object as () => IUseCase
  })
  readonly useCase!: IUseCase

  identifierWidth: number = 50
  identifierLength: number = 50

  disabled: boolean = false

  textRule: Array<any> = [ (value) => {
    const pattern = /^[a-zA-Z][a-zA-Z0-9_]+$/
    return pattern.test(value) || 'Invalid e-mail.'
  }
  ]

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

  unsubscribe: Function | null = null

  created() {
    this.$bus.$on('resizeUCBody', this.resizeBodyBox)
    this.unsubscribe = this.$store.subscribe((mutation) => {
      const { useCaseId } = mutation.payload
      if (this.useCase.id === useCaseId && ['addVR', 'addCT', 'deleteVR', 'deleteCT'].includes(mutation.type)) {
        this.$nextTick(() => {
          this.resizeBodyBox(useCaseId)
        })
      }
    })
  }

  beforeDestroy() {
    this.$bus.$off('resizeUCBody')
    this.unsubscribe && this.unsubscribe()
  }

  /* eslint-disable */
  mounted(): void {
    const uc = this.$snap.select(`#uc-${this.useCase.id}`)
    uc.drag(onMove, onStart, onEnd)

    // TODO!
    setTimeout(() => {
      this.resizeBodyBox(this.useCase.id)
    }, 680)
  }
  /* eslint-enable */

  @Watch('useCase.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string): void {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#uc-${this.useCase.id} .uc-text`)
      const bb = text.getBBox()
      this.identifierWidth = value.length * 8 + 10
      this.identifierLength = value.length * 8 + 2
    })
  }

  // editIdentifiger() {
  //   this.disabled = false
  // }

  /* eslint-disable */
  resizeBodyBox(ucId) {
    if (this.useCase.id !== ucId) return

    const body = this.$snap(`#uc-${this.useCase.id} .uc-body`)
    const bodyBox = this.$snap(`#uc-${this.useCase.id} .uc-body-box`)
    const bbBb = bodyBox.getBBox()
    const { x: bbX1, y: bbY1, w: bbW, h: bbH } = bbBb

    // 10 = padding from side borders // 27 = title height + 10 padding from border
    if(bbX1-10 || bbY1-10-27) {
      const dx = bbX1 - 10
      const dy = bbY1 - 10 - 27
      this.mutationResizeUC({ dx, dy, id: this.useCase.id })
    }

    body.stop().animate({
      width: bbW ? bbW + 20 : 250,
      height: bbH ? bbH + 20 : 150
    }, 680, mina.elastic)
  }

  updateIdentifier(identifier) {
    this.mutationUpdateUCIdent({id: this.useCase.id, identifier})
  }
  /* eslint-enable */
}
</script>

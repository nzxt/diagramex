<template lang="pug">
  g.usecase(
    :id='`uc-${useCase.id}`'
    :transform='`translate(${useCase.position.x},${useCase.position.y})`'
  )
    text.uc-pos(
      :x='identifierWidth + 10'
      y='18'
      fill='#ccc'
      font-size='12px'
    ) x:{{ useCase.position.x.toFixed() }} y:{{ useCase.position.y.toFixed() }}
    rect.uc-title(
      x='0'
      y='0'
      :width='identifierWidth'
      height='38'
      rx='5'
      ry='5'
      :style='UCTitleStyle'
    )
    rect.uc-body(
      x='0'
      y='30'
      width='150'
      height='100'
      rx='5'
      ry='5'
      :style='UCBodyStyle'
    )
    //- text.uc-text(
    //-   x='5'
    //-   y='18'
    //-   :style='UCTextStyle'
    //- ) {{ useCase.identifier }}
    foreignObject.uc-text(
      x="5"
      y="2"
      :width='identifierWidth-8'
      height="24"
    )
      v-text-field.pa-0.ma-0(
        dark
        single-line
        :rules='textRule'
        @input='updateIdentifier'
        v-model='useCase.identifier'
      )
      v-tooltip(top)
        template(v-slot:activator="{ on }")
          v-icon(
            color="primary"
            dark
            v-on="on"
          ) mdi-select-drag
        span Lorem ipsum dolor
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
      Edge(
        v-for='item in useCase.edges'
        :key='item.id'
        :edge='item'
        :useCaseId='useCase.id'
      )
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

import { IUseCase, IPosition } from '~/models/interfaces'
import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({
  components: {
    Variable: () => import('~/components/Variable.vue'),
    Constant: () => import('~/components/Constant.vue'),
    Edge: () => import('~/components/Edge.vue')
  }
})
export default class UseCaseComponent extends Vue {
  @Mutation('resizeUC') mutationResizeUC
  @Mutation('updateUCIdentifier') mutationUpdateUCIdentifier
  @Prop({
    default: () => {},
    type: Object as () => IUseCase
  })
  readonly useCase!: IUseCase

  identifierWidth: number = 50

  disabled: boolean = false

  textRule: Array<any> = [
    (value) => {
      const pattern = /^[a-zA-Z][a-zA-Z0-9_]+$/
      return pattern.test(value) || 'Invalid range'
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
    this.$bus.$on('ChildDragEnded', this.resizeBodyBox)
    this.$bus.$on('IdentifierUpdated', this.resizeBodyBox)

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
    this.$bus.$off('ChildDragEnded')
    this.$bus.$off('IdentifierUpdated')
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
      this.identifierWidth = value.length * 9 + 10
    })
  }

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
      
      this.$nextTick(() => {
        this.$bus.$emit('UseCaseResized', this.useCase.id)
      })
    }

    body.stop().animate({
      width: bbW ? bbW + 20 : 250,
      height: bbH ? bbH + 20 : 150
    }, 680, mina.elastic)
  }

  updateIdentifier(identifier) {
    this.mutationUpdateUCIdentifier({id: this.useCase.id, identifier})
  }
  /* eslint-enable */
}
</script>

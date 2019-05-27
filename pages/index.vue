<template lang='pug'>
  v-layout.justify-center
    v-flex.xs12
      v-card#editor.fill-height(v-resize='calcStageSize')
        v-card-title.py-1.title.grey.white--text.font-weight-thin
          | Viete.io
          .caption.ml-5.blue-grey--text from [ {{ dragStart.x }}, {{ dragStart.y }} ] to [ {{ dragEnd.x }}, {{ dragEnd.y }} ]
          v-spacer
          v-chip(dark small)
            .body-1 Scale: {{ scaleConfig.scaleX.toFixed(2) }} * {{ scaleConfig.scaleY.toFixed(2) }}
          v-divider.mx-3(vertical)
          v-btn.grey.lighten-1(icon small @click='scaleIn')
            v-icon.mdi-24px(color='white') mdi-magnify-plus-outline
          v-btn.grey.lighten-1(icon small @click='scaleReset')
            v-icon.mdi-24px(color='white') mdi-magnify-close
          v-btn.grey.lighten-1(icon small @click='scaleOut')
            v-icon.mdi-24px(color='white') mdi-magnify-minus-outline
          v-divider.mx-3(vertical)
          v-btn.grey.lighten-1(icon @click='showBorder')
            v-icon.mdi-24px(color='white') mdi-tab-unselected

        v-card-text.pa-0
          v-stage(ref='stage' :config='stageConfig' :class='bordered ? "bordered" : ""')
            v-layer(ref='layer' :config='{...scaleConfig}')
              //- v-circle(
              //-   :config='circleConfig'
              //-   @mouseenter='handleMouseEnter'
              //-   @mouseleave='handleMouseLeave'
              //-   @dragstart='handleDragStart'
              //-   @dragend='handleDragEnd'
              //- )
              //- v-arrow(:config='arrowConfig')
              UseCase(
                v-for='item in vuexProgramState.useCases'
                :key='item.id'
                :useCase='item'
                @uc::mouseenter='handleMouseEnter'
                @uc::mouseleave='handleMouseLeave'
                @uc::dragstart='handleDragStart'
                @uc::dragend='handleDragEnd'
              )
            v-layer(ref='dragLayer')
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import LayerScaleMixin from '~/mixins/scale-config'
import CursorPointerMixin from '~/mixins/cursor-pointer'
import DragHandlersMixin from '~/mixins/drag-handlers'

// import programState from '~/assets/program-state.json'

let vm: any = {}

@Component({
  components: {
    UseCase: () => import('~/components/UseCase.vue')
  },
  mixins: [
    LayerScaleMixin,
    CursorPointerMixin,
    DragHandlersMixin
  ]
})
export default class IndexPage extends Vue {
  @State('programState') vuexProgramState
  // programState: programState
  bordered: boolean = false

  stageConfig: any = {
    width: null,
    height: null,
    draggable: true
  }
  circleConfig: any = {
    x: 35,
    y: 35,
    radius: 35,
    fill: '#00C081',
    stroke: '#1789C3',
    strokeWidth: 5,
    opacity: 0.75,
    draggable: true,
    dragBoundFunc: function (pos) {
      const stage = vm.$refs.stage.getStage()
      const x1 = 0 + this.width() / 2
      const y1 = 0 + this.height() / 2
      const x2 = stage.width() - this.width() / 2
      const y2 = stage.height() - this.height() / 2
      const x = (pos.x < x1) ? x1 : (pos.x > x2 ? x2 : pos.x)
      const y = (pos.y < y1) ? y1 : (pos.y > y2 ? y2 : pos.y)
      return { x: x, y: y }
    }
  }
  // arrowConfig: any = {
  // x: this.programState.useCases[0].position.x,
  // y: this.programState.useCases[0].position.y,
  //   points: [
  //     this.programState.useCases[0].position.x,
  //     this.programState.useCases[0].position.y,
  //     this.programState.useCases[1].position.x,
  //     this.programState.useCases[1].position.y
  //   ],
  //   pointerLength: 20,
  //   pointerWidth: 20,
  //   fill: 'black',
  //   stroke: 'black',
  //   strokeWidth: 4
  // }

  created() {
    vm = this
  }

  calcStageSize(): void {
    const editor = document.getElementById('editor')
    const { clientWidth, clientHeight } = editor as any // TODO!
    this.stageConfig.width = clientWidth
    this.stageConfig.height = clientHeight - 76
  }

  showBorder(): void {
    this.bordered = !this.bordered
  }
}
</script>

<style lang="stylus" scoped>
 .bordered
    border 1px dashed grey
</style>

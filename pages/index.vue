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
          v-stage(
            ref='stage'
            :config='stageConfig'
            :class='bordered ? "bordered" : ""'
          )
            v-layer(
              ref='layer'
              :config='{name: "MainLayer", ...scaleConfig}'
            )
              UseCase(
                v-for='item in vuexProgramState.useCases'
                :key='item.id'
                :useCase='item'
                @uc::mouseenter='handleMouseEnter'
                @uc::mouseleave='handleMouseLeave'
                @uc::dragstart='handleDragStart'
                @uc::dragend='handleDragEnd'
              )
            v-layer(
              ref='dragLayer'
              :config='configDragLayer'
            )
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import LayerScaleMixin from '~/mixins/scale-config'
import CursorPointerMixin from '~/mixins/cursor-pointer'
import DragHandlersMixin from '~/mixins/drag-handlers'

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
  bordered: boolean = false

  stageConfig: any = {
    name: 'Stage',
    width: null,
    height: null,
    draggable: true
  }
  configDragLayer: any = {
    name: 'DragLayer',
    listening: false
  }
  mounted() {
    window.$stage = this.$refs.stage.getStage()
    window.$layer = this.$refs.layer.getNode()
    window.$dragLayer = this.$refs.dragLayer.getNode()
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

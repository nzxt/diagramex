<template lang='pug'>
  v-layout.justify-center
    v-flex.xs12
      v-card#editor.fill-height(flat v-resize='calcStageSize')
        v-card-title.py-1.title.grey.white--text.font-weight-thin
          | Viete.io
          //- .caption.ml-5.blue-grey--text from [ {{ dragStart.x }}, {{ dragStart.y }} ] to [ {{ dragEnd.x }}, {{ dragEnd.y }} ]
          v-spacer
          //- v-chip(dark small)
            //- .body-1 Scale: {{ scaleConfig.scaleX.toFixed(2) }} * {{ scaleConfig.scaleY.toFixed(2) }}
            //- v-divider.mx-3(vertical)
            //- v-btn.grey.lighten-1(icon small @click='scaleIn')
            //-   v-icon.mdi-24px(color='white') mdi-magnify-plus-outline
            //- v-btn.grey.lighten-1(icon small @click='scaleReset')
            //-   v-icon.mdi-24px(color='white') mdi-magnify-close
            //- v-btn.grey.lighten-1(icon small @click='scaleOut')
            //-   v-icon.mdi-24px(color='white') mdi-magnify-minus-outline
          v-divider.mx-3(vertical)
          v-btn.grey.lighten-1(icon @click='showBorder')
            v-icon.mdi-24px(color='white') mdi-tab-unselected

        v-card-text.ma-0.pa-0
          svg#canvas(
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            :viewBox='`0 0 ${viewBox.width} ${viewBox.height}`'
            :class='{ bordered }'
            @mousedown.shift='onShiftClickCanvas'
          )
            //- @mouseover='onMouseOver'
            //- @mouseout='onMouseOut'
            UseCase(
              v-for='item in vuexProgramState.useCases'
              :key='item.id'
              :useCase='item'
            )
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component({
  components: {
    UseCase: () => import('~/components/UseCase.vue')
  },
  mixins: []
})
export default class IndexPage extends Vue {
  @State('programState') vuexProgramState

  bordered: boolean = true
  viewBox: any = {
    width: 500,
    height: 350
  }

  mounted() {
    /* eslint-disable */
    const paper = this.$snap('#canvas')

    // ZPD with options and callback
    // const options = {
    //   zoom: true,
    //   pan: false,
    //   drag: true
    // }
    // paper.zpd(options, (error, paper) => {
    //   console.log(`${paper} // ${error}`)
    // })
    /* eslint-enable */
  }

  /* eslint-disable */
  onClickCanvas(evt): void {
    console.log('Canvas shift-clicked...', parent)
  }
  /* eslint-enable */

  calcStageSize(): void {
    const editor = document.getElementById('editor')
    const { clientWidth, clientHeight } = editor as any // TODO!
    this.viewBox.width = clientWidth
    this.viewBox.height = clientHeight - 110
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

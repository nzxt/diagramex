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
          )
            defs
              path#smiley(d="M50,10 A40,40,1,1,1,50,90 A40,40,1,1,1,50,10 M30,40 Q36,35,42,40 M58,40 Q64,35,70,40 M30,60 Q50,75,70,60 Q50,75,30,60")
              rect#rect(x='75' y='75' width='150' height='75' fill='orange')
            use(href="#smiley")
            use(href="#rect")
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component({
  components: {},
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
    const sgr = this.$snap('#smiley')
    sgr.drag()
    const r = this.$snap('#rect')
    r.drag()

    const paper = this.$snap('#canvas')
    const bigCircle = paper
      .circle(250, 250, 100)
      .attr({ fill: '#1507ef' })
      .drag()
    paper.add(bigCircle)

    paper.zpd()

    /* eslint-disable */
    // with options and callback
    paper.zpd({ drag: true }, (error, paper) => {
      console.log(error)
    })
    /* eslint-enable */
  }

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

path
  fill: yellow
  stroke: black
  stroke-width: 8px
  stroke-linecap: round
  stroke-linejoin: round
  pointer-events: none
</style>

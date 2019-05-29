<template lang='pug'>
  v-layout.justify-center
    v-flex.xs12
      v-card#editor.fill-height(flat v-resize='calcStageSize')
        v-card-title.py-1.title.grey.white--text.font-weight-thin
          | Viete.io
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

        v-responsive#field
          svg#canvas(
            :viewBox='`0 0 ${viewBox.width} ${viewBox.height}`'
            :class='{ bordered }'
            preserveAspectRatio='xMidYMid meet'
          )
            g
              UseCase(
                v-for='item in vuexProgramState.useCases'
                :key='item.id'
                :useCase='item'
              )
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'

@Component({
  components: {
    UseCase: () => import('~/components/UseCase.vue')
  },
  mixins: []
})
export default class IndexPage extends Vue {
  @State('programState') vuexProgramState
  @Mutation('updateUCPosition') mutationUpdateUCPosition
  @Mutation('updateVRPosition') mutationUpdateVRPosition

  bordered: boolean = true
  viewBox: any = {
    width: 500,
    height: 350
  }

  mounted() {
    this.$nextTick(() => {
      this.calcStageSize()
    })
    /* eslint-disable */
    const paper = this.$snap('#canvas')

    // ZPD with options and callback
    const options = {
      zoom: true,
      pan: true,
      drag: false
    }

    paper.zpd(options, (error, paper) => {
      console.log(`${paper} // ${error}`)
    })
    /* eslint-enable */
  }

  created() {
    this.$bus.$on('dragEnd', this.onDragEnd)
  }
  beforeDestroy() {
    this.$bus.$off('dragEnd')
  }

  /* eslint-disable */
  onDragEnd ({ x, y, nodeId, nodeParentId }): void {
    const type = nodeId.substring(0,2)
    const id = nodeId.substring(3)
    const pid = nodeParentId.substring(3)

    switch(type){
      case 'uc': {
        this.mutationUpdateUCPosition({ x, y, id })
        break
      }
      case 'vr': {
        this.mutationUpdateVRPosition({ x, y, id, pid })
        break
      }
      default: console.log('Unknown element..')
    }

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

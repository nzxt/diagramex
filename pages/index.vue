<template lang='pug'>
  v-layout.justify-center
    v-flex.xs12
      v-card#editor.fill-height(v-resize='calcStageSize')
        svg#canvas(
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio='xMidYMid meet'
          @contextmenu.stop.prevent='onContextMenu'
          class='bordered'
          width='100%'
          height='100%'
        )
          //- @click="newArrow"
          //- xmlns:xlink="http://www.w3.org/1999/xlink"
          //- :viewBox='`0 0 ${viewBox.width} ${viewBox.height}`'
          //- :width='viewBox.width'
          //- :height='viewBox.height'
          g
            UseCase(
              v-for='item in vuexProgramState.useCases'
              :key='item.id'
              :useCase='item'
            )
          defs
            marker#arrow(
              orient="auto"
              markerWidth='4'
              markerHeight='4'
              refX='1' refY='2'
            )
              polyline(points='0,0 4,2 0,4 0,0' fill="grey")
    v-menu(
      v-model='showMenu'
      :position-x='menuX'
      :position-y='menuY'
      absolute
      offset-y
    )
      v-list(dense)
        v-list-tile(
          v-for='(item, index) in menuItems[`${menuType}`]'
          :key='index'
          @click.stop.prevent='doStuff(item.value)'
        )
          v-list-tile-title {{ item.text }}

    //- #thumbViewContainer
    //-   svg#scopeContainer.thumbViewClass
    //-     g
    //-       rect#scope(fill="red" fill-opacity="0.1" stroke="red" stroke-width="2px" x="0" y="0" width="0" height="0")
    //-       line#line1(stroke="red" stroke-width="2px" x1="0" y1="0" x2="0" y2="0")
    //-       line#line2(stroke="red" stroke-width="2px" x1="0" y1="0" x2="0" y2="0")
    //-   embed#thumbView.thumbViewClass(type="image/svg+xml" src="nuxtjs.svg")
</template>

<script lang='ts'>
import svgPanZoom from 'svg-pan-zoom'
import { thumbnailViewer } from '~/assets/thumbnailViewer'

import { Component, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'

import MenuMixin from '~/mixins/menu'

@Component({
  components: {
    UseCase: () => import('~/components/UseCase.vue')
  },
  mixins: [MenuMixin]
})
export default class IndexPage extends Vue {
  @State('programState') vuexProgramState
  @Mutation('updateUCPosition') mutationUpdateUCPosition
  @Mutation('updateVRPosition') mutationUpdateVRPosition
  @Mutation('updateCTPosition') mutationUpdateCTPosition

  viewBox: any = {
    width: 500,
    height: 350
  }

  mounted() {
    this.$nextTick(() => {
      this.calcStageSize()
    })

    const paper = this.$snap('#canvas')

    const spz = svgPanZoom('#canvas', {
      panEnabled: true,
      controlIconsEnabled: false,
      zoomEnabled: true,
      dblClickZoomEnabled: false,
      mouseWheelZoomEnabled: true,
      preventMouseEventsDefault: true,
      zoomScaleSensitivity: 0.2,
      minZoom: 0.5,
      maxZoom: 10,
      fit: false,
      contain: false,
      center: false,
      refreshRate: 'auto'
    })

    // thumbnailViewer({
    //   mainViewId: 'canvas',
    //   thumbViewId: 'thumbView'
    // })
  }

  created() {
    this.$bus.$on('DragEnded', this.onDragEnd)
  }

  beforeDestroy() {
    this.$bus.$off('DragEnded')
  }

  onDragEnd({ x, y, nodeId, nodeParentId }): void {
    const type = nodeId.substring(0, 2)
    const id = nodeId.substring(3)
    const useCaseId = nodeParentId.substring(3)

    switch (type) {
      case 'uc': {
        this.mutationUpdateUCPosition({ x, y, id })
        break
      }
      case 'vr': {
        this.mutationUpdateVRPosition({ x, y, id, useCaseId })
        break
      }
      case 'ct': {
        this.mutationUpdateCTPosition({ x, y, id, useCaseId })
        break
      }
      default: console.log('Unknown element..') // eslint-disable-line
    }
  }

  calcStageSize() {
    const editor = document.getElementById('editor')
    const { clientWidth, clientHeight } = editor as any // TODO!
    this.viewBox.width = clientWidth
    this.viewBox.height = clientHeight - 7
  }

  // newArrow(evt) {
  //   const { clientX, clientY } = evt
  //   const elem = this.$snap.getElementByPoint(clientX, clientY)
  // }
}
</script>

<style lang="stylus" scoped>
  .thumbViewClass
    border: 1px solid black
    position: absolute
    bottom: 5px
    left: 5px
    width: 10%
    height: 20%
    margin: 3px
    padding: 3px
    overflow: hidden

  #thumbView
    z-index: 110
    background: white

  #scopeContainer
    z-index: 120
</style>

<template lang='pug'>
  svg(
    xmlns="http://www.w3.org/2000/svg"
    @mousedown.ctrl='onMouseDown'
    @mouseup='onMouseUp'
    @mousemove.ctrl='onMoveTarget'
    width='100%'
    height='100%'
  )
    circle#fake-target(
      :cx='cursorPos.x' :cy='cursorPos.y' r='0' fill='orange'
    )
    g
      UseCase(
        v-for='item in programState.useCases'
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
</template>

<script lang='ts'>
import svgPanZoom from 'svg-pan-zoom'
import { thumbnailViewer } from '~/assets/thumbnailViewer'

import { Component, Prop, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'

import ConnectionMixin from '~/mixins/connection'
import { IProgramState } from '../models/interfaces'

@Component({
  components: {
    UseCase: () => import('~/components/UseCase.vue')
  },
  mixins: [ConnectionMixin]
})
export default class EditorComponent extends Vue {
  @Prop({
    default: () => {},
    type: Object as () => IProgramState
  })
  readonly programState!: IProgramState

  @Mutation('updateUCPosition') mutationUpdateUCPosition
  @Mutation('updateVRPosition') mutationUpdateVRPosition
  @Mutation('updateCTPosition') mutationUpdateCTPosition

  spz: any = null

  mounted() {
    this.initSPZ()
  }

  initSPZ() {
    const options: any = {
      panEnabled: true,
      controlIconsEnabled: true,
      zoomEnabled: true,
      dblClickZoomEnabled: false,
      mouseWheelZoomEnabled: true,
      preventMouseEventsDefault: true,
      zoomScaleSensitivity: 0.2,
      minZoom: 0.2,
      maxZoom: 5,
      fit: false,
      contain: false,
      center: false,
      refreshRate: 'auto'
    }

    this.spz = svgPanZoom('#canvas', options)
  }

  created() {
    this.$bus.$on('DragEnded', this.onDragEnd)
  }

  beforeDestroy() {
    this.$bus.$off('DragEnded', this.onDragEnd)
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

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
          //- :viewBox='`0 0 ${viewBox.width} ${viewBox.height}`'
          //- :width='viewBox.width'
          //- :height='viewBox.height'
          g
            UseCase(
              v-for='item in vuexProgramState.useCases'
              :key='item.id'
              :useCase='item'
            )
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
</template>

<script lang='ts'>
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
    // setTimeout(() => {
      this.calcStageSize()
    // }, 680)
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
}
</script>

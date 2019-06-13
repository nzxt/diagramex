<template lang='pug'>
  v-layout.justify-center
    v-flex.xs12
      splitpanes(watch-slots class="default-theme")
        span(
          id='editor-pane'
          splitpanes-min="60"
          splitpanes-max="80"
          splitpanes-size="80"
        )
          v-card#editor.fill-height(
            @contextmenu.stop.prevent='onContextMenu'
            v-resize='calcStageSize'
          )
            Editor#canvas(
              ref='editor'
              :programState='vuexProgramState'
              :viewBox='viewBox'
            )
        span(
          id='text-pane'
          splitpanes-min="20"
          splitpanes-max="40"
          splitpanes-size="20"
        )
          v-textarea.ma-2(
            flat
            no-resize
            row-height='24'
            label='Comment'
            hint='This field will keep your comments'
            persistent-hint
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
import 'splitpanes/dist/splitpanes.css'

import { Component, Watch, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'

import MenuMixin from '~/mixins/menu'

@Component({
  components: {
    Splitpanes: () => import('splitpanes'),
    Editor: () => import('~/components/Editor.vue')
  },
  mixins: [MenuMixin]
})
export default class IndexPage extends Vue {
  @State('programState') vuexProgramState

  viewBox: any = {
    width: 500,
    height: 350
  }

  // mounted() {
  // this.$nextTick(() => {
  //   this.calcStageSize()
  // })
  // }

  calcStageSize() {
    const editor = document.getElementById('editor')
    const { clientWidth, clientHeight } = editor as any
    this.viewBox.width = clientWidth
    this.viewBox.height = clientHeight - 7
  }
}
</script>

<style lang="stylus" scoped>
  #text-pane
    >>> textarea
      height: 80vh
</style>

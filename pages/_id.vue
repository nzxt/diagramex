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
            v-if='vuexProgramState'
            @contextmenu.stop.prevent='onContextMenu'
          )
            Editor#canvas(
              ref='editor'
              :programState='vuexProgramState'
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
            label='Text markup'
            persistent-hint
          )

    NavigationDrawer

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
import { State, Action } from 'vuex-class'

import MenuMixin from '~/mixins/menu'

@Component({
  components: {
    Splitpanes: () => import('splitpanes'),
    NavigationDrawer: () => import('~/components/Navigation.vue'),
    Editor: () => import('~/components/Editor.vue')
  },
  mixins: [MenuMixin]
})
export default class ProjectPage extends Vue {
  @State('programState') vuexProgramState
  @State('project') vuexProject
  @State('programs') vuexPrograms
  @Action('getProjectById') actionGetProjectById

  created() {
    const { id } = this.$route.params
    if (!this.vuexProject && id) this.actionGetProjectById(id)
  }
}
</script>

<style lang="stylus" scoped>
  #text-pane
    >>> textarea
      height: 80vh
</style>

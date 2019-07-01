<template lang="pug">
  div
    v-navigation-drawer(
      v-model='drawer'
      :clipped='clipped'
      stateless
      fixed
      app
    )
      v-card(flat)
        v-layout(row wrap align-center pl-2)
          v-flex.xs10
            .title(class='blue-grey--text') Diagrams
          v-flex.xs2(text-xs-center)
            v-btn(
              icon
              v-if="drawer"
              @click.stop.prevent='addProgram'
            )
              v-icon(
                flat
                mdi-18px
                color='blue-grey'
              ) mdi-plus

        v-layout(row nowrap align-center)
          v-flex.xs12
            v-list(dense)
              v-list-tile(
                v-for='item in vuexPrograms'
                :key='item.id'
              )
                v-list-tile-content
                  v-list-tile-title
                    .subheading(
                      @click='openDiagram(item)'
                      class='blue-grey--text'
                    ) {{item.programName}}
                v-list-tile-action
                  v-menu(bottom left v-if='vuexProject')
                    template(v-slot:activator='{ on }')
                      v-icon.small.mt-1.font-weight-thin( color='blue-grey' v-on='on') mdi-menu-down
                    v-list(dense)
                      v-list-tile(v-for='(menu, i) in items' :key='i' @click)
                        //- v-list-tile-action
                        //-   v-checkbox(color='blue-grey')
                        v-list-tile-content(@click="action(menu)")
                          v-list-tile-title.blue-grey--text {{ menu.title }}
    v-dialog(
      v-if='vuexProgram'
      v-model='dialog'
      max-width='290'
    )
      v-card
        v-card-text
          v-text-field(
            label='Program name'
            v-model='vuexProgram.programName'
            )
        v-card-actions
          v-spacer
          v-btn(color='green darken-1' flat='flat' @click='dialog = false') Cansel
          v-btn(color='green darken-1' flat='flat' @click='updateProgram(vuexProgram)') Save
    v-fab-transition.mt-5
      v-btn(
        class='mt-5 ml-0'
        color='blue-grey'
        dark
        fab
        fixed
        bottom
        left
        @click='drawer=!drawer'
      )
        v-icon mdi-menu
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { Project } from '~/models/Project'
import { ProgramState } from '~/models/ProgramState'

@Component({})
export default class NavigationDrawer extends Vue {
  clipped: Boolean = true
  drawer: Boolean = false
  readonlyProjectName: Boolean = true
  dialog: Boolean = false
  readonly: Boolean = true
  ProjectName: Boolean = true
  items: Array<any> = [
    { title: 'Rename' },
    { title: 'Delete' }
  ]

  max25chars: Array<Function> = [v => (v.length >= 3 && v.length <= 25) || 'Input must be 3 - 25 chars!']

  @State('project') vuexProject
  @State('programs') vuexPrograms
  @State('programState') vuexProgram
  // @Action('createProject') actionCreateProject
  @Action('createProgram') actionCreateProgram
  @Action('getProgramById') actionGetProgramById
  @Action('putProject') actionPutProject
  @Action('putProgram') actionPutProgram
  @Action('deleteProject') actionDeleteProject
  @Action('deleteProgram') actionDeleteProgram

  action(item) {
    if (item.title === 'Rename') {
      this.openDiagram(this.vuexProgram)
      this.dialog = true
    }
    if (item.title === 'Delete') {
      this.deleteProgram(this.vuexProgram)
    }
  }

  openDiagram(item) {
    this.actionGetProgramById(item)
  }

  updateProject(item) {
    this.actionPutProject(item)
  }

  updateProgram(item) {
    this.dialog = false
    this.actionPutProgram(item)
  }

  deleteProgram(item) {
    this.actionDeleteProgram(item)
  }

  addProgram() {
    const projectId = this.$route.params.id
    const program = new ProgramState('NewProgram', projectId)
    this.actionCreateProgram(program)
  }
}
</script>

<style lang="stylus" scoped>

</style>

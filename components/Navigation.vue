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
        v-layout.mt-2.ml-2(row nowrap align-top)
          v-flex#project-name.xs10
            v-text-field(
              v-if='vuexProject'
              clearable
              color='blue-grey'
              label="Project name"
              :readonly='readonlyProjectName'
              @dblclick.stop.prevent='(e) => { readonlyProjectName = false; e.target.focus() }'
              @blur='readonlyProjectName = true'
              @change='updateProject(vuexProject)'
              v-model='vuexProject.projectName'
            )

          v-flex.xs2.pt-1(text-xs-center)
            v-dialog(v-model='dialog' persistent max-width='290')
              template(v-slot:activator='{ on }')
                v-btn(
                  icon
                  flat
                  v-on="on"
                  )
                  v-icon(
                    mdi-18px
                    color='blue-grey'
                  ) mdi-delete-forever
              v-card
                v-card-text Are you really want to delete this project?
                v-card-actions
                  v-spacer
                  v-btn(color='blue-grey' flat @click='dialog = false') Disagree
                  v-btn(color='blue-grey' flat @click='deleteProject(vuexProject.id)') Agree

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
                @click='openDiagram(item)'
              )
                  v-text-field(
                    v-model='item.programName'
                    :readonly='readonly'
                    @dblclick.stop.prevent='readonly =! readonly'
                    @change='updateProgram(item)'
                    :rules='[...max25chars]'
                    single-line
                    append-outer-icon='mdi-close'
                    @click:append-outer='deleteProgram(item)'
                  )

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

  openDiagram(item) {
    this.actionGetProgramById(item)
  }

  updateProject(item) {
    this.actionPutProject(item)
  }

  updateProgram(item) {
    this.actionPutProgram(item)
  }

  deleteProject(id) {
    this.dialog = false
    this.actionDeleteProject(id)
    this.$router.push('/')
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

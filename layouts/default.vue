<template lang="pug">
  v-app
    v-navigation-drawer(
      v-model='drawer'
      :clipped='clipped'
      stateless
      fixed
      app
    )
      v-card
        v-layout(row wrap align-center pt-2 pl-2)
          v-flex.xs8(class='ma-0 pa-0')
            v-text-field(
              v-if='vuexProject'
              dark='true'
              single-line
              dense
              outline
              class='ma-0 pa-0'
              background-color='blue-grey'
              color='blue-grey'
              :readonly='readonlyProjectName'
              @dblclick.stop.prevent='readonlyProjectName=!readonlyProjectName'
              @change='updateProject(vuexProject)'
              v-model='vuexProject.projectName'
            )
          v-flex.xs4(text-xs-center)
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
                  ) mdi-window-close
              v-card
                v-card-text Are you really want to delete this project?
                v-card-actions
                  v-spacer
                  v-btn(color='blue-grey' flat @click='dialog = false') Disagree
                  v-btn(color='blue-grey' flat @click='deleteProject(vuexProject.id)') Agree
        v-layout(row wrap align-center pl-2)
          v-flex.xs8
            .title(class='blue-grey--text') Diagrams
          v-flex.xs4(text-xs-center)
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
        v-layout(row wrap align-center pl-2)
          v-flex.xs12
            v-data-table(
              v-if="drawer"
              hide-actions
              hide-headers
              :items='vuexPrograms'
              )
                template(v-slot:items='props')
                  tr(@click='openDiagram(props.item)')
                    td.display-2.px-0(text-xs-left)
                      v-text-field(
                        v-model='props.item.programName'
                        dense
                        :readonly='readonly'
                        @dblclick.stop.prevent='readonly=!readonly'
                        @change='updateProgram(props.item)'
                        :rules='[...max25chars]'
                        single-line
                        class='ma-0 pa-0'
                      )
                    td(text-xs-right)
                      v-btn(
                        icon
                        @click='deleteProgram(props.item)'
                      )
                        v-icon(mdi-18px color='blue-grey') mdi-window-close
    v-toolbar.blue-grey(
      :clipped-left='clipped'
      fixed
      app
    )
      v-toolbar-title.white--text
        .display-1.font-weight-thin {{ title }}
      //- v-breadcrumbs(:items='items')
      //-   template(v-slot:item='props')
      //-     a(
      //-       :class='[props.item.disabled && \'disabled\']'
      //-     ) {{ props.item.text.toUpperCase() }}
      v-spacer
      span.body-2.white--text(v-if='vuexProject') {{vuexProject.projectName}}
      span.body-2.white--text(v-if='vuexProgram') {{'/ '+vuexProgram.programName}}
      v-spacer
      v-btn(
        flat
        to="/"
        router
        exact
      ).body-1.white--text.font-weight-medium {{projects}}
      v-btn(
        flat
        router
        exact
        @click.stop.prevent='createNewProject'
        v-if="!authorized"
      ).body-1.white--text.font-weight-medium {{create}}
      v-chip(
        dark
        v-if="!authorized"
        color="blue-grey darken-1"
      )
        v-btn.ma-0.pa-0(
          flat
          to='/projects'
          router
          exact
          depressed
          round
        )
          v-avatar
            img(src='https://avatars0.githubusercontent.com/u/9064066?v=4&s=460')
          span Jon Leider
      v-btn(
        flat
        v-if="authorized"
        @click='authorized=!authorized'
      ).body-1.white--text.font-weight-medium {{login}}
      v-btn(
        flat
        v-if="!authorized"
        @click='authorized=!authorized'
      ).body-1.white--text.font-weight-medium {{logout}}
    v-content
      v-container(fluid fill-height)
        nuxt
    v-footer.justify-center.grey--text(:inset='fixed' app)
      span.caption.font-weight-bold {{ title }} © 2019.
      span.ml-1.caption.font-weight-thin {{ powered }}
    v-fab-transition(class='mt-5')
      v-btn(
        v-model='fab'
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
export default class DefaultLayout extends Vue {
  fixed: boolean = true
  clipped: boolean = true
  drawer: boolean = false
  readonlyProjectName: boolean = true
  dialog: boolean = false
  readonly: boolean = true
  ProjectName: boolean = true
  title: string = 'Viete.io'
  projects: string = 'All projects'
  create: string = 'Create project'
  login: string = 'Login'
  logout: string = 'Logout'
  powered: string = 'powered by molfarDevs'
  myName: string = 'Uliana'
  authorized: boolean = true
  snack: boolean = false
  snackColor: string = ''
  snackText: string = ''
  max25chars: Array<Function> = [v => (v.length >= 3 && v.length <= 25) || 'Input must be 3 - 25 chars!']
  items: Array<any> = [
    { title: 'Diagram 1' },
    { title: 'Diagram 2' },
    { title: 'Diagram 3' },
    { title: 'Diagram 4' }
  ]

  @State('project') vuexProject
  @State('programs') vuexPrograms
  @State('programState') vuexProgram
  @Action('createProject') actionCreateProject
  @Action('createProgram') actionCreateProgram
  @Action('getProgramById') actionGetProgramById
  @Action('putProject') actionPutProject
  @Action('putProgram') actionPutProgram
  @Action('deleteProject') actionDeleteProject
  @Action('deleteProgram') actionDeleteProgram

  createNewProject() {
    const project = new Project('NewProject')
    const program = new ProgramState('NewProgram', '')
    this.actionCreateProject({ project, program })
    this.$router.push(this.vuexProject.id)
  }

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

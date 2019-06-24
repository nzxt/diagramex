<template lang="pug">
  v-app
    v-navigation-drawer(
      v-model='drawer'
      :mini-variant.sync="mini"
      :clipped='clipped'
      stateless
      fixed
      app
    )
      v-toolbar.transparent(flat v-if="!mini")
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(src='https://randomuser.me/api/portraits/men/85.jpg')
            v-list-tile-content
              v-list-tile-title.subheading.blue-grey--text John Leider
            v-list-tile-action
              v-btn(
                icon
                @click.stop='mini = !mini'
              )
                v-icon(color='blue-grey') chevron_left
      v-list.pt-0(v-if='vuexProject')
        v-list-tile
          v-list-tile-action(v-if="mini")
            v-tooltip(right color='blue-grey')
              template(v-slot:activator='{ on }')
                v-icon(
                  v-on="on"
                  color='blue-grey'
                ) mdi-settings-outline
              span Settings
          v-list-tile-content
            v-layout(row)
              v-flex.xs8
                v-text-field(
                  :dark='true'
                  label='Project name'
                  class='blue-grey--text'
                  background-color='blue-grey'
                  box
                  single-line
                  hide-details
                  dense
                  @change='updateProject(vuexProject)'
                  v-model='vuexProject.projectName'
                )
              v-flex.xs4(text-xs-center)
                v-btn(
                  icon
                  flat
                  @click='deleteProject(vuexProject.id)'
                  )
                  v-icon(
                    mdi-18px
                    color='red lighten-3'
                  ) mdi-window-close
      v-data-table(
        v-if="!mini"
        hide-actions
        hide-headers
        :items='vuexPrograms'
        class='ma-1'
        )
          template(v-slot:items='props')
            td.blue-grey--text
              v-text-field(
                v-model='props.item.programName'
                dense
                :rules='[max25chars]'
                label='Edit'
                single-line
                counter
              )
            td(text-xs-right)
              v-btn(
                icon
                @click='deleteProgram(props.item)'
              )
                v-icon(mdi-18px color='red lighten-3') mdi-window-close
      v-flex(text-xs-center)
        v-btn(
          dark
          small
          color='blue-grey'
          v-if="!mini"
          @click.stop.prevent='addProgram'
        ) Add program
    v-toolbar.blue-grey(
      :clipped-left='clipped'
      fixed
      app
    )
      v-toolbar-title.white--text
        .display-1.font-weight-thin {{ title }}
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
  drawer: boolean = true
  mini: boolean = true
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
  @Action('createProject') actionCreateProject
  @Action('createProgram') actionCreateProgram
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

  updateProject(item) {
    this.actionPutProject(item)
  }
  deleteProject(id) {
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

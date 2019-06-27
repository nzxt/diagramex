<template lang="pug">
  v-app
    //- v-navigation-drawer(
    //-   v-if="loggedIn"
    //-   v-model='drawer'
    //-   :clipped='clipped'
    //-   stateless
    //-   fixed
    //-   app
    //- )
    //-   v-card
    //-     v-layout.mt-2.ml-2(row nowrap align-top)
    //-       v-flex#project-name.xs10
    //-         v-text-field(
    //-           v-if='vuexProject'
    //-           clearable
    //-           color='blue-grey'
    //-           label="Project name"
    //-           :readonly='readonlyProjectName'
    //-           @dblclick.stop.prevent='(e) => { readonlyProjectName = false; e.target.focus() }'
    //-           @blur='readonlyProjectName = true'
    //-           @change='updateProject(vuexProject)'
    //-           v-model='vuexProject.projectName'
    //-         )

    //-       v-flex.xs2.pt-1(text-xs-center)
    //-         v-dialog(v-model='dialog' persistent max-width='290')
    //-           template(v-slot:activator='{ on }')
    //-             v-btn(
    //-               icon
    //-               flat
    //-               v-on="on"
    //-               )
    //-               v-icon(
    //-                 mdi-18px
    //-                 color='blue-grey'
    //-               ) mdi-delete-forever
    //-           v-card
    //-             v-card-text Are you really want to delete this project?
    //-             v-card-actions
    //-               v-spacer
    //-               v-btn(color='blue-grey' flat @click='dialog = false') Disagree
    //-               v-btn(color='blue-grey' flat @click='deleteProject(vuexProject.id)') Agree

    //-     v-layout(row wrap align-center pl-2)
    //-       v-flex.xs10
    //-         .title(class='blue-grey--text') Diagrams
    //-       v-flex.xs2(text-xs-center)
    //-         v-btn(
    //-           icon
    //-           v-if="drawer"
    //-           @click.stop.prevent='addProgram'
    //-         )
    //-           v-icon(
    //-             flat
    //-             mdi-18px
    //-             color='blue-grey'
    //-           ) mdi-plus

    //-     v-layout(row nowrap align-center)
    //-       v-flex.xs12
    //-         v-list(dense)
    //-           v-list-tile(
    //-             v-for='item in vuexPrograms'
    //-             :key='item.id'
    //-             @click='openDiagram(item)'
    //-           )
    //-              v-text-field(
    //-                 v-model='item.programName'
    //-                 :readonly='readonly'
    //-                 @dblclick.stop.prevent='readonly =! readonly'
    //-                 @change='updateProgram(item)'
    //-                 :rules='[...max25chars]'
    //-                 single-line
    //-                 append-outer-icon='mdi-close'
    //-                 @click:append-outer='deleteProgram(item)'
    //-               )

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
      //- span.body-2.white--text(v-if='vuexProject') {{vuexProject.projectName}}
      //- span.body-2.white--text(v-if='vuexProgram') {{'/ '+vuexProgram.programName}}
      v-spacer
      v-btn(
        flat
        to="/"
        router
        exact
      ).body-1.white--text.font-weight-medium {{ projects }}

      v-btn(
        flat
        router
        exact
        @click.stop.prevent='createNewProject'
        v-if="loggedIn"
      ).body-1.white--text.font-weight-medium {{ create }}

      v-btn.ma-0.pa-0(
        color='blue-grey darken-1'
        v-if="loggedIn"
        @click='$router.push("/projects")'
        dark
        exact
        depressed
        round
      )
        v-avatar(size='32')
          img(:src='userPic')
        .ml-2.mr-3 {{ userName }}

      v-btn(
        flat
        v-if="!loggedIn"
        @click='facebookSignIn'
      ).body-1.white--text.font-weight-medium {{ login }}

      v-btn(
        flat
        v-if="loggedIn"
        @click='signOut'
      ).body-1.white--text.font-weight-medium {{logout}}

    v-content
      v-container(fluid fill-height)
        nuxt

    v-footer.justify-center.grey--text(:inset='fixed' app)
      span.caption.font-weight-bold {{ title }} © 2019.
      span.ml-1.caption.font-weight-thin {{ powered }}

    //- v-fab-transition.mt-5(v-if="loggedIn")
    //-   v-btn(
    //-     class='mt-5 ml-0'
    //-     color='blue-grey'
    //-     dark
    //-     fab
    //-     fixed
    //-     bottom
    //-     left
    //-     @click='drawer=!drawer'
    //-   )
    //-     v-icon mdi-menu
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { Project } from '~/models/Project'
import { ProgramState } from '~/models/ProgramState'

@Component({})
export default class DefaultLayout extends Vue {
  fixed: Boolean = true
  clipped: Boolean = true
  // drawer: Boolean = false
  // readonlyProjectName: Boolean = true
  // dialog: Boolean = false
  // readonly: Boolean = true
  // ProjectName: Boolean = true
  title: string = 'Viete.io'
  projects: string = 'All projects'
  create: string = 'Create project'
  login: string = 'SignIn'
  logout: string = 'SignOut'
  powered: string = 'powered by molfarDevs'
  // snack: Boolean = false
  // snackColor: string = ''
  // snackText: string = ''

  // max25chars: Array<Function> = [v => (v.length >= 3 && v.length <= 25) || 'Input must be 3 - 25 chars!']

  // items: Array<any> = [
  //   { title: 'Diagram 1' },
  //   { title: 'Diagram 2' },
  //   { title: 'Diagram 3' },
  //   { title: 'Diagram 4' }
  // ]

  @State('project') vuexProject
  // @State('programs') vuexPrograms
  // @State('programState') vuexProgram
  @Action('createProject') actionCreateProject
  @Action('createProgram') actionCreateProgram
  // @Action('getProgramById') actionGetProgramById
  // @Action('putProject') actionPutProject
  // @Action('putProgram') actionPutProgram
  // @Action('deleteProject') actionDeleteProject
  // @Action('deleteProgram') actionDeleteProgram

  async createNewProject() {
    const project = new Project(`NewProject`)
    await this.actionCreateProject(project)
    const program = new ProgramState('NewProgram', this.vuexProject.id)
    await this.actionCreateProgram(program)
    this.$router.push(this.vuexProject.id)
  }

  // openDiagram(item) {
  //   this.actionGetProgramById(item)
  // }

  // updateProject(item) {
  //   this.actionPutProject(item)
  // }

  // updateProgram(item) {
  //   this.actionPutProgram(item)
  // }

  // deleteProject(id) {
  //   this.dialog = false
  //   this.actionDeleteProject(id)
  //   this.$router.push('/')
  // }

  // deleteProgram(item) {
  //   this.actionDeleteProgram(item)
  // }

  // addProgram() {
  //   const projectId = this.$route.params.id
  //   const program = new ProgramState('NewProgram', projectId)
  //   this.actionCreateProgram(program)
  // }

  async facebookSignIn() {
    await this.$auth.loginWith('facebook')
      .catch(e => console.warn(e))
  }

  async signOut() {
    await this.$auth.logout()
  }

  get loggedIn(): Boolean {
    return this.$store.state.auth
      ? this.$store.state.auth.loggedIn
      : false
  }

  get userPic(): string {
    return this.$auth.user
      ? this.$auth.user.picture.data.url
      : 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460'
  }
  get userName(): string {
    return this.$auth.user
      ? this.$auth.user.name
      : 'Stas K.'
  }
}
</script>

<style lang="stylus" scoped>
  // .v-text-field
  //   >>> input#project-name
  //     padding-top 0

  // #project-name
  //   >>> .v-text-field--outline
  //     > .v-input__control
  //       > .v-input__slot
  //         min-height 48px !important
</style>

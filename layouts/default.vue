<template lang="pug">
  v-app
    v-toolbar.blue-grey(
      :clipped-left='clipped'
      fixed
      app
    )
      v-toolbar-title(@click='$router.push("/")' style='cursor: pointer').white--text
        .display-1.font-weight-thin.mr-1 {{ title }}
      v-layout(v-if='breadcrumbs')
        v-icon.small.pt-2.font-weight-thin( color='white' v-if='vuexProject') mdi-chevron-right
        span.white--text.title.font-weight-thin.pt-2(v-if='vuexProject') {{vuexProject.projectName}}
        v-menu(bottom left v-if='vuexProject')
          template(v-slot:activator='{ on }')
            v-icon.small.pt-2.font-weight-thin( color='white' v-on='on') mdi-menu-down
          v-list(dense)
            v-list-tile(v-for='(item, i) in items' :key='i' @click)
              //- v-list-tile-action
              //-   v-checkbox(color='blue-grey')
              v-list-tile-content(@click="action(item.title)")
                v-list-tile-title.blue-grey--text {{ item.title }}
        v-icon.small.pt-2.font-weight-thin( color='white' v-if='vuexProgram') mdi-chevron-right
        span.white--text.title.font-weight-thin.pt-2(v-if='vuexProgram') {{vuexProgram.programName}}
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

    ProjectNameDialog(
      v-if='breadcrumbs'
      :dialog='dialog'
      :project='vuexProject'
      @close='dialog = false'
    )
    ImportDialog(
      :dialog='importDialog'
      @close::ImportDialog='importDialog = false'
    )
    v-dialog(
      v-model='deleteDialog'
      persistent
      max-width='290'
    )
      v-card
        v-card-text Are you really want to delete this project?
        v-card-actions
          v-spacer
          v-btn(
            color='green darken-1'
            flat
            @click='deleteDialog = false'
          ) Disagree
          v-btn(
            color='green darken-1'
            flat
            @click='deleteProject(vuexProject.id)'
          ) Agree
    v-footer.justify-center.grey--text(:inset='fixed' app)
      span.caption.font-weight-bold {{ title }} © 2019.
      span.ml-1.caption.font-weight-thin {{ powered }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { Project } from '~/models/Project'
import { ProgramState } from '~/models/ProgramState'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

@Component({
  auth: false,
  components: {
    ProjectNameDialog: () => import('~/components/ProjectNameDialog.vue'),
    ImportDialog: () => import('~/components/ImportDialog.vue')
  }
})
export default class DefaultLayout extends Vue {
  fixed: Boolean = true
  clipped: Boolean = true
  dialog: Boolean = false
  importDialog: Boolean = false
  deleteDialog: Boolean = false
  title: string = 'Viete.io'
  projects: string = 'All projects'
  create: string = 'Create project'
  login: string = 'SignIn'
  logout: string = 'SignOut'
  powered: string = 'powered by molfarDevs'

  // max25chars: Array<Function> = [v => (v.length >= 3 && v.length <= 25) || 'Input must be 3 - 25 chars!']

  items: Array<any> = [
    { title: 'Rename' },
    { title: 'Export' },
    { title: 'Import' },
    { title: 'Allow/disallow to edit all' },
    { title: 'Fork project' },
    { title: 'Delete' }
  ]

  @State('project') vuexProject
  @State('programState') vuexProgram
  @State('programs') vuexPrograms
  @Action('createProject') actionCreateProject
  @Action('createProgram') actionCreateProgram
  // @Action('getProgramById') actionGetProgramById
  // @Action('putProject') actionPutProject
  // @Action('putProgram') actionPutProgram
  @Action('deleteProject') actionDeleteProject
  // @Action('deleteProgram') actionDeleteProgram

  async createNewProject() {
    const userId = this.$auth.user.id
    const project = new Project(`NewProject`, userId)
    await this.actionCreateProject(project)
    const program = new ProgramState('NewProgram', this.vuexProject.id)
    await this.actionCreateProgram(program)
    this.$router.push(this.vuexProject.id)
  }

  action(title) {
    if (title === 'Rename') {
      this.openDialog()
    }
    if (title === 'Export') {
      this.downloadFile()
    }
    if (title === 'Import') {
      this.openImportDialog()
    }
    if (title === 'Delete') {
      this.deleteDialog = true
    }
  }

  openDialog() {
    this.dialog = true
  }

  openImportDialog() {
    this.importDialog = true
  }

  downloadFile() {
    const zip = new JSZip()
    const self = this
    this.vuexPrograms.forEach((x) => {
      const file = JSON.stringify(x)
      zip.file(`${x.programName}.json`, file)
    })
    zip.generateAsync({ type: 'blob' })
      .then(
        function (blob) { // 1) generate the zip file
          saveAs(blob, `${self.vuexProject.projectName}.zip`) // 2) trigger the download
        },
        function (err) { alert(`${err}`) }
      )
  }

  deleteProject(id) {
    this.deleteDialog = false
    this.actionDeleteProject(id)
    this.$router.push('/')
  }

  async facebookSignIn() {
    await this.$auth.loginWith('facebook')
      .catch(e => console.warn(e))
  }

  async signOut() {
    await this.$auth.logout()
  }

  get breadcrumbs() {
    return !!this.vuexProject && this.$route.name === 'id'
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
</style>

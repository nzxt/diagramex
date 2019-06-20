<template lang="pug">
  v-app
    v-toolbar.blue-grey(fixed app)
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
        to='/new'
        @click='newProject'
        router
        exact
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
          @click='userProjects'
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
      v-container(fluid fill-height white)
        nuxt
    v-footer.justify-center.grey--text(:inset='fixed' app)
      span.caption.font-weight-bold {{ title }} © 2019.
      span.caption.font-weight-thin {{ powered }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'
@Component({})
export default class DefaultLayout extends Vue {
  fixed: boolean = true
  title: string = 'Viete.io'
  projects: string = 'All projects'
  create: string = 'Create project'
  login: string = 'Login'
  logout: string = 'Logout'
  powered: string = 'powered by molfarDevs'
  myName: string = 'Uliana'
  authorized: boolean = true

  @Action('fetchUserProjects')actionGetAllUserProjects

  newProject() {
    this.$router.push('new')
  }

  userProjects() {
    this.$router.push('/projects')
    this.actionGetAllUserProjects()
  }
}
</script>

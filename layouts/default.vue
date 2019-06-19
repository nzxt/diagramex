<template lang="pug">
  v-app
    v-navigation-drawer(
      v-model='drawer'
      :clipped='clipped'
      stateless
      fixed
      app
    )
      v-toolbar.transparent(flat)
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(src='https://randomuser.me/api/portraits/men/85.jpg')
            v-list-tile-content
              v-list-tile-title.subheading.blue-grey--text John Leider
      v-text-field(
        :dark='true'
        label='Project name'
        class='mx-4 blue-grey--text'
        background-color='blue-grey'
        box
        single-line
        hide-details
        dense
      )
      v-data-table(
          hide-actions
          hide-headers
          :items='items'
          class='ma-1'
        )
        template(v-slot:items='props')
          td.blue-grey--text
            span.body-2 {{ props.item.title }}
          td(text-xs-right)
            v-btn(
              icon
            )
              v-icon(mdi-18px color='red lighten-3') mdi-trash-can-outline
    v-toolbar.blue-grey(
      :clipped-left='clipped'
      fixed
      app
    )
      v-toolbar-side-icon.white--text.font-weight-thin(
        @click='drawer = !drawer'
      )
      v-toolbar-title.white--text
        .headline.font-weight-thin {{ title }}
      v-spacer
      v-btn(
        flat
        to="/"
        router
        exact
      ).body-1.white--text.font-weight-medium {{projects}}
      v-btn(
        flat
        to='/my_project'
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
@Component({})
export default class DefaultLayout extends Vue {
fixed: boolean = true
clipped: boolean = true
drawer: boolean = true
title: string = 'Viete.io'
projects: string = 'All projects'
create: string = 'Create project'
login: string = 'Login'
logout: string = 'Logout'
powered: string = 'powered by molfarDevs'
myName: string = 'Uliana'
authorized: boolean = true
items: Array<any> = [
  { title: 'Diagram 1' },
  { title: 'Diagram 2' },
  { title: 'Diagram 3' },
  { title: 'Diagram 4' }
]
}
</script>

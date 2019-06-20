<template lang="pug">
  v-layout(row)
    v-flex(xs5)
      v-card(@click='openProject(item)')
        v-data-table(
          hide-actions
          hide-headers
          :items='allProjects'
          class='ma-1'
        )
          template(v-slot:items='props')
            tr(@click='openProject(item)')
              td.blue-grey--text
                span.body-2 {{ props.item.projectName }} / {{ props.item.athor }}
                div.grey--text {{props.item.description}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
@Component({
  layout: 'main'
})
export default class IndexPage extends Vue {
  // projects: Array<any> = [
  //   { projectName: 'Payment system', athor: 'StasK', description: 'A Vue.js 2.0 single page application with Laravel 5.3 ' },
  //   { projectName: 'Framework', athor: 'Chopin', description: 'The Vue.js Framework' },
  //   { projectName: 'Payment system', athor: 'StasK', description: 'A Vue.js 2.0 single page application with Laravel 5.3 ' },
  //   { projectName: 'Framework', athor: 'Chopin', description: 'The Vue.js Framework' },
  //   { projectName: 'Payment system', athor: 'StasK', description: 'A Vue.js 2.0 single page application with Laravel 5.3 ' },
  //   { projectName: 'Framework', athor: 'Chopin', description: 'The Vue.js Framework' },
  //   { projectName: 'Payment system', athor: 'StasK', description: 'A Vue.js 2.0 single page application with Laravel 5.3 ' },
  //   { projectName: 'Framework', athor: 'Chopin', description: 'The Vue.js Framework' },
  //   { projectName: 'Translator', athor: 'David', description: 'Vue component for isotope filter & sort magical ' }
  // ]
  @State('projects')projects
  @Action('fetchProjects')actionGetAllProjects
  @Action('fetchProjectPrograms')actionGetProjectPrograms

  created() {
    this.actionGetAllProjects()
  }

  get allProjects() {
    const { projects } = this
    return projects
  }

  openProject(item) {
    item = { id: 'myId' } // for test
    this.actionGetProjectPrograms()
    this.$router.push(item.id)
  }
}
</script>

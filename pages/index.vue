<template lang="pug">
  v-layout(row)
    v-flex(xs5)
      v-card
        v-data-table(
          hide-actions
          hide-headers
          :items='projects'
          class='ma-1'
        )
          template(v-slot:items='props')
            td.blue-grey--text
              span.body-2 {{ props.item.projectName }} / {{ props.item.athor }}
              div.grey--text {{props.item.description}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  layout: 'main'
})
export default class IndexPage extends Vue {
  projects: Array<any> = [
    { projectName: 'Payment system', athor: 'StasK', description: 'A Vue.js 2.0 single page application with Laravel 5.3 ' },
    { projectName: 'Framework', athor: 'Chopin', description: 'The Vue.js Framework' },
    { projectName: 'Payment system', athor: 'StasK', description: 'A Vue.js 2.0 single page application with Laravel 5.3 ' },
    { projectName: 'Framework', athor: 'Chopin', description: 'The Vue.js Framework' },
    { projectName: 'Payment system', athor: 'StasK', description: 'A Vue.js 2.0 single page application with Laravel 5.3 ' },
    { projectName: 'Framework', athor: 'Chopin', description: 'The Vue.js Framework' },
    { projectName: 'Payment system', athor: 'StasK', description: 'A Vue.js 2.0 single page application with Laravel 5.3 ' },
    { projectName: 'Framework', athor: 'Chopin', description: 'The Vue.js Framework' },
    { projectName: 'Translator', athor: 'David', description: 'Vue component for isotope filter & sort magical ' }
  ]
}
</script>

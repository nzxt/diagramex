<template lang="pug">
  v-layout(row)
    v-flex(xs5)
      v-card
        v-data-table(
          hide-actions
          hide-headers
          :items='vuexProjects'
          class='ma-1'
        )
          template(v-slot:items='props')
            tr(@click='getProjectById(props.item)')
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
  @State('projects') vuexProjects
  @Action('fetchProjects') actionFetchProjects
  @Action('getProjectById') actionGetProjectById

  created() {
    this.actionFetchProjects()
  }

  getProjectById(item) {
    const { id } = item
    this.actionGetProjectById(id)
    this.$router.push(id)
  }
}
</script>

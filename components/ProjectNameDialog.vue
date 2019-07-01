<template lang="pug">
v-layout(row justify-center)
  v-dialog(v-model='dialog' max-width='290')
    v-card
      v-card-text
        v-text-field(
          label='Project name'
          v-model='project.projectName'
          )
      v-card-actions
        v-spacer
        v-btn(color='green darken-1' flat='flat' @click='dialog = false') Cansel
        v-btn(color='green darken-1' flat='flat' @click='changeProjectName(project)') Save
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation } from 'vuex-class'
@Component({})
export default class PNDialogComponent extends Vue {
  @Action('putProject')actionPutProject

  @Prop({
    default: () => {},
    type: Object
  })
  readonly project!: string

  @Prop({
    default: false,
    type: Boolean
  })
  dialog!: boolean

  changeProjectName(project) {
    this.actionPutProject(project)
    this.dialog = false
  }
}
</script>

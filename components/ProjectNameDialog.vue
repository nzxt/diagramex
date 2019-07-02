<template lang="pug">
  v-layout(row justify-center)
    v-dialog(
      :value='dialog'
      max-width='290'
      persistent
      )
      v-card
        v-card-text
          v-text-field(
            label='Project name'
            v-model='projectName'
          )
        v-card-actions
          v-spacer
          v-btn(color='green darken-1' flat='flat' @click='onCancel') Cancel
          v-btn(color='green darken-1' flat='flat' @click='onSave') Save
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'

import { IProject } from '../models/interfaces'

@Component({})
export default class PNDialogComponent extends Vue {
  @Action('putProject') actionPutProject

  @Prop({
    default: () => {},
    type: Object as () => IProject
  })
  readonly project!: IProject

  @Prop({
    default: false,
    type: Boolean
  })
  readonly dialog!: boolean

  projectName: string = ''

  @Watch('dialog')
  onChangeDialog(value: Boolean) {
    if (!value) return
    this.projectName = this.project.projectName
  }

  onSave() {
    const project = { ...this.project, projectName: this.projectName }
    this.actionPutProject(project)
    this.$emit('close')
  }

  onCancel() {
    this.$emit('close')
  }
}
</script>

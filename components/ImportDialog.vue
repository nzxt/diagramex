<template lang="pug">
  v-layout(row justify-center)
    v-dialog(
      :value='dialog'
      max-width='290'
      persistent
      )
      v-card
        v-card-text
        v-card-title Uploading file
          input(type="file" id="file" name="file")
        v-card-actions
          v-spacer
          v-btn(color='green darken-1' flat @click='onCancel') Cancel
          v-btn(color='green darken-1' flat @click='onSave') Save
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import JSZip from 'jszip'

@Component({})
export default class PNDialogComponent extends Vue {
  @State('project') vuexProject
  @Action('putProject') actionPutProject
  @Action('getProjectById') actionGetProjectById

  @Prop({
    default: false,
    type: Boolean
  })
  readonly dialog!: boolean

  projectName: string = ''

  uploadFile(files) {
    // const { files } = evt.target
    if (!files.length) return

    return JSZip.loadAsync(files[0])
      .then((zip) => {
        const fileNames = Object.keys(zip.files)
        const programs = fileNames.map((name) => {
          return zip.file(name).async('string')
            .then(data => JSON.parse(data))
        })
        return Promise.all(programs)
      })
      .then(async (programs) => {
        programs.forEach((x) => { x.projectId = this.vuexProject.id })
        const project = Object.assign({}, this.vuexProject, { programs })
        await this.actionPutProject(project)
        await this.actionGetProjectById(project.id)
      })
  }

  async onSave() {
    const { files } = document.getElementById('file') as any
    await this.uploadFile(files)
    this.$emit('close::ImportDialog')

    // const project = Object.assign({}, this.vuexProject, { programs })
    // await this.actionPutProject(project)
    // await this.actionGetProjectById(project.id)
  }

  onCancel() {
    this.$emit('close::ImportDialog')
  }
}
</script>

import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ScaleConfigMixin extends Vue {
  handleMouseEnter(): void {
    const stage = this.$refs.stage.getStage()
    stage.container().style.cursor = 'pointer'
  }

  handleMouseLeave(): void {
    const stage = this.$refs.stage.getStage()
    stage.container().style.cursor = 'default'
  }
}

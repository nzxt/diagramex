import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ScaleConfigMixin extends Vue {
  scaleConfig: any = {
    scaleX: 1,
    scaleY: 1
  }

  scaleIn() {
    this.scaleConfig.scaleX *= 1.2
    this.scaleConfig.scaleY *= 1.2
  }

  scaleOut() {
    this.scaleConfig.scaleX /= 1.2
    this.scaleConfig.scaleY /= 1.2
  }

  scaleReset() {
    this.scaleConfig.scaleX = 1
    this.scaleConfig.scaleY = 1
  }
}

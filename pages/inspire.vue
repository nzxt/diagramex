<template lang='pug'>
  v-layout(wrap)
    v-flex.xs12.text-xs-center
      img(
        src="/v.png"
        alt="Viete.io"
      )
      blockquote.blockquote
        | &#8220;First, solve the problem. Then, write the code.&#8221;
        footer
          small
            em &mdash;John Johnson

    v-flex.xs12.text-xs-center
      v-stage.bordered(:config="configKonva")
        v-layer
          v-circle(:config="configCircle")
          v-rect(:config="configRect")
          v-line(:config="configLine")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class InspirePage extends Vue {
  configKonva: any = {
    width: 1100,
    height: 250
  }
  configCircle: any = {
    x: 400,
    y: 100,
    radius: 70,
    fill: '#4b7cef',
    stroke: '#2e2e2e',
    strokeWidth: 5,
    draggable: true
  }
  configRect: any = {
    x: 500,
    y: 50,
    width: 250,
    height: 150,
    fill: 'red',
    stroke: '#e6b7a4',
    strokeWidth: 5,
    shadowBlur: 10,
    draggable: true
  }
  configLine: any = {
    x: 420,
    y: 150,
    points: [0, 0, 100, 0, 100, 100],
    tension: 0.5,
    closed: true,
    stroke: 'black',
    fillLinearGradientStartPoint: { x: -50, y: -50 },
    fillLinearGradientEndPoint: { x: 50, y: 50 },
    fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
    draggable: true
  }
}
</script>

<style lang="stylus" scoped>
 .bordered
    border 1px dashed grey
</style>

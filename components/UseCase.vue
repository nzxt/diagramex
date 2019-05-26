<template lang="pug">
  v-group(:config='groupConfig')
    v-text(:config='textConfig')
    v-rect(:config='titleConfig')
    v-rect(:config='bodyConfig')
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class UseCase extends Vue {
  groupConfig: any = {
    x: 0,
    y: 0,
    draggable: true
  }
  textConfig: any = {
    x: 0,
    y: 0,
    text: 'COMPLEX TEXT',
    fontSize: 14,
    fontFamily: 'Calibri',
    fill: '#fff',
    // width: 100,
    padding: 10,
    align: 'left',
    zIndex: 3
  }
  titleConfig: any = {
    x: 0,
    y: 0,
    stroke: '#555',
    strokeWidth: 2,
    fill: '#2BC30A',
    width: 300,
    height: 35,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: [10, 10],
    shadowOpacity: 0.2,
    cornerRadius: 5,
    opacity: 0.75,
    zIndex: 1
  }
  bodyConfig: any = {
    x: 0,
    y: 30,
    stroke: '#555',
    strokeWidth: 2,
    fill: '#6FBAE6',
    width: 400,
    height: 200,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: [10, 10],
    shadowOpacity: 0.2,
    cornerRadius: 5,
    // opacity: 0.75,
    zIndex: 2
  }
}
</script>

<style lang="stylus" scoped>

</style>

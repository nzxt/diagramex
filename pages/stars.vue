<template lang="pug">
v-layout.justify-center
  v-flex.xs12
    v-card#editor.fill-height(v-resize='calcSize')
      v-card-title.title.grey.white--text.font-weight-thin
        | Viete.io
        | Drag ended in: [{{ dragEndX }}, {{ dragEndY }} ]
      v-card-text.pa-0(v-show='!loading')
        v-stage(
          ref='stage'
          :config='configKonva'
          @contextmenu='onRClickCanvas'
        )
          v-layer(ref='layer' draggable=true)
            v-star.pointer(
              v-for='item in list'
              :key='item.id'
              :config='item'
              @dragstart='handleDragstart'
              @dragend='handleDragend'
            )
          v-layer(ref='dragLayer')

      v-card-text(v-show='loading')
        v-layout.justify-center.align-center
          v-flex(xs12)
            v-icon.mdi-18px(:class='loading ? "mdi-spin warning--text" : "success--text"') {{ loading ? 'mdi-camera-iris' : 'mdi-check-circle-outline' }}
            span.ml-1.subheaing {{ loading ? loadingMsg : readyMsg }}

  v-menu(
    v-model="showMenu"
    :position-x="menuX"
    :position-y="menuY"
    absolute
    offset-y
  )
    v-list(dense)
      v-list-tile(@click="reset")
        v-list-tile-title {{ 'Reset Stage' }}
      v-list-tile(@click="randomize")
        v-list-tile-title {{ 'Randomize Stars' }}
</template>

<script>
import Konva from 'konva'

export default {
  data() {
    return {
      showMenu: false,
      menuX: null,
      menuY: null,
      readyMsg: 'Ready!',
      loadingMsg: 'Loading...',
      loading: false,
      list: [],
      configKonva: {
        width: null,
        height: null,
        draggable: true
      },
      dragEndX: 0,
      dragEndY: 0
    }
  },

  mounted() {
    this.calcSize()
    this.$nextTick(() => {
      this.randomize()
    })
  },

  methods: {
    calcSize() {
      const { clientWidth, clientHeight } = document.getElementById('editor')
      this.configKonva.width = clientWidth
      this.configKonva.height = clientHeight - 52
    },

    reset() {
      this.loading = true

      const layer = this.$refs.layer.getNode()

      layer.destroyChildren()
      // layer.draw()

      this.randomize()

      setTimeout(() => {
        this.loading = false
      }, 618)
    },

    randomize() {
      for (let n = 0; n < 30; n++) {
        const scale = Math.random()
        const stage = this.$refs.stage.getStage()

        this.list.push({
          x: Math.random() * stage.width(),
          y: Math.random() * stage.height(),
          rotation: Math.random() * 180,
          numPoints: 5,
          innerRadius: 30,
          outerRadius: 50,
          fill: '#89b717',
          opacity: 0.8,
          draggable: true,
          scaleX: scale,
          scaleY: scale,
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          shadowOpacity: 0.6,
          startScale: scale
        })
      }
    },

    handleDragstart(e) {
      const shape = e.target
      const dragLayer = this.$refs.dragLayer.getNode()
      const stage = this.$refs.stage.getStage()
      // moving to another layer will improve dragging performance
      shape.moveTo(dragLayer)
      stage.draw()
      shape.setAttrs({
        shadowOffsetX: 15,
        shadowOffsetY: 15,
        scaleX: shape.getAttr('startScale') * 1.2,
        scaleY: shape.getAttr('startScale') * 1.2
      })
    },

    handleDragend(e) {
      const shape = e.target
      const layer = this.$refs.layer.getNode()
      const stage = this.$refs.stage.getStage()
      shape.moveTo(layer)
      stage.draw()
      shape.to({
        duration: 0.5,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: shape.getAttr('startScale'),
        scaleY: shape.getAttr('startScale'),
        shadowOffsetX: 5,
        shadowOffsetY: 5
      })
      this.dragEndX = shape.attrs.x.toFixed()
      this.dragEndY = shape.attrs.y.toFixed()
    },

    onRClickCanvas(ctx) {
      if (!ctx.evt) return
      ctx.evt.preventDefault()

      const { clientX, clientY } = ctx.evt

      this.menuX = clientX
      this.menuY = clientY

      this.$nextTick(() => {
        this.showMenu = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .pointer
    cursor pointer
</style>

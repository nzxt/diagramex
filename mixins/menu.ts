import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

import { UseCase } from '~/models/UseCase'

@Component
export default class MenuMixin extends Vue {
  @Mutation('addUC') mutationAddUC

  showMenu: boolean = false
  menuType: string = 'cn'
  menuX: number = 0
  menuY: number = 0

  canvasX: number = 0
  canvasY: number = 0

  menuItems: any = {
    // Canvas
    cn: [
      { text: 'Create Usecase', value: 'createUsecase' }
    ],
    // Usecase
    uc: [
      { text: 'Create Variable', value: 'createUsecase' },
      { text: 'Create Constant', value: 'createConstant' },
      { text: 'Create Tuple', value: 'createTuple' },
      { text: '---', value: '' },
      { text: 'Delete Usecase', value: 'deleteUsecase' }
    ],
    // Variable
    vr: [
      { text: 'Delete Variable', value: 'deleteVariable' }
    ],
    // Constant
    ct: [
      { text: 'Delete Constant', value: 'deleteConstant' }
    ],
    // Tuple
    tp: [
      { text: 'Delete Tuple', value: 'deleteTuple' }
    ]
  }

  onContextMenu(evt): void {
    const { clientX, clientY } = evt
    const { layerX, layerY } = evt

    const elem = this.$snap.getElementByPoint(clientX, clientY)
    const parent = elem.parent()
    const { id: nodeParentId } = parent.node
    const type = nodeParentId.substring(0, 2) || 'cn'

    this.menuType = type
    this.menuX = clientX
    this.menuY = clientY

    this.canvasX = layerX
    this.canvasY = layerY

    this.$nextTick(() => {
      this.showMenu = true
    })
  }

  doStuff(value: string): void {
    if (!value) return
    this[`${value}`]()
    this.showMenu = false
  }

  createUsecase() {
    const { canvasX: x, canvasY: y } = this
    const usecase = new UseCase('UseCase', x, y)
    this.mutationAddUC(usecase)
  }
}
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

import { UseCase } from '~/models/UseCase'
import { Variable } from '~/models/Variable'
import { Constant } from '~/models/Constant'

@Component
export default class MenuMixin extends Vue {
  @Mutation('addUC') mutationAddUC
  @Mutation('addVR') mutationAddVR
  @Mutation('addCT') mutationAddCT
  @Mutation('deleteUC') mutationDeleteUC
  @Mutation('deleteVR') mutationDeleteVR
  @Mutation('deleteCT') mutationDeleteCT

  showMenu: boolean = false
  menuType: string = 'cn'
  menuX: number = 0
  menuY: number = 0
  nodeParentId: string = ''
  mainNodeParentId: string = ''

  canvasX: number = 0
  canvasY: number = 0
  e: number = 0
  f: number = 0

  menuItems: Object = {
    // Canvas
    cn: [
      { text: 'Create Usecase', value: 'createUsecase' }
    ],
    // Usecase
    uc: [
      { text: 'Create Variable', value: 'createVariable' },
      { text: 'Create Constant', value: 'createConstant' },
      // { text: 'Create Tuple', value: 'createTuple' },
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
    const mainParent = parent.parent().parent()

    const { id: nodeParentId } = parent.node
    const { id: mainParentId } = mainParent.node

    let type = nodeParentId.substring(0, 2)
    const menuKeys = Object.keys(this.menuItems)
    type = menuKeys.includes(type) ? type : 'cn'

    this.nodeParentId = nodeParentId.substring(3)
    this.mainNodeParentId = mainParentId.substring(3)

    this.menuType = type
    this.menuX = clientX
    this.menuY = clientY
    this.canvasX = layerX
    this.canvasY = layerY

    if (type === 'uc') {
      const paper = this.$snap('#canvas')
      const matrixZPD = paper.zpd('save') // eslint-disable-line
      const { e, f } = parent.matrix
      this.e = e + matrixZPD.e
      this.f = f + matrixZPD.f
    }

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

  createVariable() {
    let { canvasX: x, canvasY: y } = this
    x -= this.e
    y -= this.f
    const variable = new Variable('Variable', x, y)
    this.mutationAddVR({ variable, useCaseId: this.nodeParentId })
  }

  createConstant() {
    let { canvasX: x, canvasY: y } = this
    x -= this.e
    y -= this.f
    const constant = new Constant('Constant', x, y)
    this.mutationAddCT({ constant, useCaseId: this.nodeParentId })
  }

  deleteUsecase() {
    this.mutationDeleteUC(this.nodeParentId)
  }

  deleteVariable() {
    this.mutationDeleteVR({ useCaseId: this.mainNodeParentId, variableId: this.nodeParentId })
  }

  deleteConstant() {
    this.mutationDeleteCT({ useCaseId: this.mainNodeParentId, constantId: this.nodeParentId })
  }
}

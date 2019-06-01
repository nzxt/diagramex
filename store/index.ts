// import { MutationTree, ActionContext, ActionTree } from 'vuex'
import { MutationTree } from 'vuex'
import { IProgramState, IUseCase } from '../models/interfaces'
import programState from '~/assets/programState.json'

export const strict = false

export interface IRootState {}

export interface IState {
  programState: IProgramState;
}

export const state = (): IState => ({
  programState: programState || {}
})

export const mutations: MutationTree<IState> = {
  addUC: (state, value: IUseCase) => {
    state.programState.useCases.push(value)
  },

  addVR: (state, value: any) => {
    const { variable, useCaseId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    state.programState.useCases[index].variables.push(variable)
  },

  addCT: (state, value: any) => {
    const { constant, useCaseId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    state.programState.useCases[index].constants.push(constant)
  },

  updateUCPosition: (state, value: any) => {
    const { x, y, id } = value
    const index = state.programState.useCases.findIndex(x => x.id === id)
    state.programState.useCases[index].position.x = x
    state.programState.useCases[index].position.y = y
  },

  updateVRPosition: (state, value: any) => {
    const { x, y, id, useCaseId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexCT = state.programState.useCases[index].variables.findIndex(x => x.id === id)
    state.programState.useCases[index].variables[indexCT].position.x = x
    state.programState.useCases[index].variables[indexCT].position.y = y
  },

  updateCTPosition: (state, value: any) => {
    const { x, y, id, useCaseId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexCT = state.programState.useCases[index].constants.findIndex(x => x.id === id)
    state.programState.useCases[index].constants[indexCT].position.x = x
    state.programState.useCases[index].constants[indexCT].position.y = y
  },

  deleteUC: (state, value: string) => {
    const index = state.programState.useCases.findIndex(x => x.id === value)
    state.programState.useCases.splice(index, 1)
  },

  deleteVR: (state, value: any) => {
    const { useCaseId, variableId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexVR = state.programState.useCases[index].variables.findIndex(x => x.id === variableId)
    state.programState.useCases[index].variables.splice(indexVR, 1)
  },

  deleteCT: (state, value: any) => {
    const { useCaseId, constantId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexCT = state.programState.useCases[index].constants.findIndex(x => x.id === constantId)
    state.programState.useCases[index].constants.splice(indexCT, 1)
  },

  resizeUC: (state, value: any): void => {
    const { dx, dy, id } = value
    const index = state.programState.useCases.findIndex(x => x.id === id)
    state.programState.useCases[index].position.x += dx
    state.programState.useCases[index].position.y += dy
    state.programState.useCases[index].variables.forEach((v) => {
      v.position.x -= dx
      v.position.y -= dy
    })
    state.programState.useCases[index].constants.forEach((c) => {
      c.position.x -= dx
      c.position.y -= dy
    })
  }
}

// export interface Actions<S, R> extends ActionTree<S, R> {
//   actionFunctionName (context: ActionContext<S, R>, value: any): void
// }

// export const actions: Actions<IState, IRootState> = {
//   actionFunctionName(store, value: any): void {}
// }

import { MutationTree } from 'vuex'
import { IProgramState, IUseCase } from '../models/interfaces'
import programState from '~/assets/program-state.json'

export const strict = false

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
    const { x, y, id, pid } = value
    const pIndex = state.programState.useCases.findIndex(x => x.id === pid)
    const index = state.programState.useCases[pIndex].variables.findIndex(x => x.id === id)
    state.programState.useCases[pIndex].variables[index].position.x = x
    state.programState.useCases[pIndex].variables[index].position.y = y
  },

  updateCTPosition: (state, value: any) => {
    const { x, y, id, pid } = value
    const pIndex = state.programState.useCases.findIndex(x => x.id === pid)
    const index = state.programState.useCases[pIndex].constants.findIndex(x => x.id === id)
    state.programState.useCases[pIndex].constants[index].position.x = x
    state.programState.useCases[pIndex].constants[index].position.y = y
  },

  deleteUC: (state, value: any) => {
    const { useCaseId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
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
  }

}

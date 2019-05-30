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
  }
}

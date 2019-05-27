import { MutationTree } from 'vuex'
import { IProgramState } from '../models/interfaces'
import programState from '~/assets/program-state.json'

export const strict = false

export interface IState {
  programState: IProgramState;
}

export const state = (): IState => ({
  programState: programState
})

export const mutations: MutationTree<IState> = {
  updateUCPosition: (state, value: any) => {
    const { id, position: { x, y } } = value
    const index = state.programState.useCases.findIndex(x => x.id === id)
    state.programState.useCases[index].position.x = x
    state.programState.useCases[index].position.y = y
  }
}

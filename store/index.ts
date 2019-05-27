import { MutationTree } from 'vuex'
import { IProgramState } from '../models/interfaces'
import programState from '~/assets/program-state.json'

export const strict = false

export interface IState {
  programState: IProgramState | null;
}

export const state = (): IState => ({
  programState: programState
})

export const mutations: MutationTree<IState> = {
  setProgramState: (state, value: IProgramState) => { state.programState = value }
}

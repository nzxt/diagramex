// import { MutationTree, ActionContext, ActionTree } from 'vuex'
import { MutationTree } from 'vuex'
import { IProgramState, IUseCase, IProject } from '../models/interfaces'
import programState from '~/assets/programState.json'
const BaseURL = 'http://127.0.0.1:5000'

export const strict = false

export interface IRootState {}

export interface IState {
  programState: IProgramState;
  projects: [];
  project: IProject;
  programs: [];
}

export const state = (): IState => ({
  programState: programState || {}
})

export const actions: any = {
  async  fetchProjects({ commit }) {
    await this.$axios.get(BaseURL + '/projects')
      .then(({ data }) => {
        commit('setProjects', data)
      })
      .catch(function (error) {
        console.log(error)
      })
  },

  async getProjectById({ commit }, value: any) {
    await this.$axios.get(BaseURL + `/projects/${value}`)
      .then(({ data }) => {
        commit('setProject', data)
      })
      .catch(function (error) {
        console.log(error)
      })
  },

  async createProject({ commit }, project, program) {
    let data = project
    await this.$axios.post(BaseURL + `/project`, data)
      .then(({ data }) => {
      })
      .catch(function (error) {
        console.log(error)
      })

    data = program
    await this.$axios.post(BaseURL + `/program`, data)
      .then(({ data }) => {
      })
      .catch(function (error) {
        console.log(error)
      })

    await this.getProjectById({ commit }, project.id)
  },

  async putProject({ commit }, value: any) {
    await this.$axios.put(BaseURL + `/projects/${value.id}`, value)
      .then(({ data }) => {
        commit('setProject', data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export const mutations: MutationTree<IState> = {
  setProjects: (state, value: any) => {
    state.projects = value
  },

  setProject: (state, value: any) => {
    state.project = value
    state.programs = value.programs
  },

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

  addED: (state, value: any) => {
    const { edge, useCaseId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    state.programState.useCases[index].edges.push(edge)
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
    const indexVR = state.programState.useCases[index].variables.findIndex(x => x.id === id)
    state.programState.useCases[index].variables[indexVR].position.x = x
    state.programState.useCases[index].variables[indexVR].position.y = y
  },

  updateCTPosition: (state, value: any) => {
    const { x, y, id, useCaseId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexCT = state.programState.useCases[index].constants.findIndex(x => x.id === id)
    state.programState.useCases[index].constants[indexCT].position.x = x
    state.programState.useCases[index].constants[indexCT].position.y = y
  },

  updateUCIdentifier: (state, value: any) => {
    const { id, identifier } = value
    const index = state.programState.useCases.findIndex(x => x.id === id)
    state.programState.useCases[index].identifier = identifier
  },

  updateVRIdentifier: (state, value: any) => {
    const { useCaseId, id, identifier } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexVR = state.programState.useCases[index].variables.findIndex(x => x.id === id)
    state.programState.useCases[index].variables[indexVR].identifier = identifier
  },

  updateCTIdentifier: (state, value: any) => {
    const { useCaseId, id, identifier } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indeCT = state.programState.useCases[index].constants.findIndex(x => x.id === id)
    state.programState.useCases[index].constants[indeCT].identifier = identifier
  },

  updateEDIdentifier: (state, value: any) => {
    const { useCaseId, id, identifier } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexED = state.programState.useCases[index].edges.findIndex(x => x.id === id)
    state.programState.useCases[index].edges[indexED].identifier = identifier
  },

  updateEDTarget: (state, value: any) => {
    const { useCaseId, id, targetId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexED = state.programState.useCases[index].edges.findIndex(x => x.id === id)
    state.programState.useCases[index].edges[indexED].targetId = targetId
  },

  deleteUC: (state, value: string) => {
    const index = state.programState.useCases.findIndex(x => x.id === value)
    state.programState.useCases.splice(index, 1)
  },

  deleteVR: (state, value: any) => {
    const { useCaseId, variableId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    let indexED: any = null
    do {
      indexED = state.programState.useCases[index].edges.findIndex(x => x.targetId === variableId || x.sourceId === variableId)
      state.programState.useCases[index].edges.splice(indexED, 1)
    } while (indexED !== -1)
    const indexVR = state.programState.useCases[index].variables.findIndex(x => x.id === variableId)
    state.programState.useCases[index].variables.splice(indexVR, 1)
  },

  deleteCT: (state, value: any) => {
    const { useCaseId, constantId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    let indexED: any = null
    do {
      indexED = state.programState.useCases[index].edges.findIndex(x => x.targetId === constantId || x.sourceId === constantId)
      state.programState.useCases[index].edges.splice(indexED, 1)
    } while (indexED !== -1)
    const indexCT = state.programState.useCases[index].constants.findIndex(x => x.id === constantId)
    state.programState.useCases[index].constants.splice(indexCT, 1)
  },

  deleteED: (state, value: any) => {
    const { useCaseId, edgeId } = value
    const index = state.programState.useCases.findIndex(x => x.id === useCaseId)
    const indexED = state.programState.useCases[index].edges.findIndex(x => x.id === edgeId)
    state.programState.useCases[index].edges.splice(indexED, 1)
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

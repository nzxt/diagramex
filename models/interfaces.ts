export interface IProject {
  id?: string,
  projectName: string,
  userId?: string,
  programs?: IProgramState[]
}

export interface IProgramState {
  id?: string,
  projectId: string,
  programName: string,
  useCases?: IUseCase[]
}

export interface IUseCase {
  id?: string,
  identifier: string,
  position: IPosition,
  variables: IVariable[],
  constants: IConstant[],
  edges: IEdge[]
}

export interface IVariable {
  id?: string,
  identifier: string,
  position: IPosition,
  comment?: string
}

export interface IConstant {
  id?: string,
  identifier: string,
  position: IPosition,
  comment?: string
}

export interface IEdge {
  id?: string,
  identifier: string,
  sourceId: string,
  targetId: string,
  comment?: string
}

export interface IPosition {
  x: number
  y: number
}

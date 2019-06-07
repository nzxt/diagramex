export interface IProgramState {
  useCases: IUseCase[]
}

export interface IUseCase {
  id?: string,
  identifier: string,
  position: IPosition,
  variables: IVariable[],
  constants: IConstant[],
  edges?: Array<any>
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

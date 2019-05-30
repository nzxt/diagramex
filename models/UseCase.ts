import { IUseCase, IPosition, IVariable, IConstant } from './interfaces'
const uuidv4 = require('uuid/v4')

export class UseCase implements IUseCase {
  constructor(
    identifier: string,
    x: number,
    y: number
  ) {
    this.id = uuidv4()
    this.identifier = identifier
    this.position = { x, y }
    this.variables = []
    this.constants = []
    this.edges = []
  }
  id: string;
  identifier: string;
  position: IPosition;
  variables: IVariable[];
  constants: IConstant[];
  edges: Array<any>;
}

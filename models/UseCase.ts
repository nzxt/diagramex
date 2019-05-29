const uuidv5 = require('uuid/v5')
import { IUseCase, IPosition, IVariable, IConstant } from "./interfaces"

export class UseCase implements IUseCase {
  constructor(
    identifier: string,
    x: number,
    y: number
  ) {
    this.id = uuidv5()
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

import { IVariable, IPosition } from './interfaces'
const uuidv4 = require('uuid/v4')

export class Variable implements IVariable {
  constructor(
    identifier: string,
    x: number,
    y: number
  ) {
    this.id = uuidv4()
    this.identifier = identifier
    this.position = { x, y }
  }
  id: string;
  identifier: string;
  position: IPosition;
}

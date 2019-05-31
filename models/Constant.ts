import { IConstant, IPosition } from './interfaces'
const uuidv4 = require('uuid/v4')

export class Constant implements IConstant {
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

import { IEdge } from './interfaces'
const uuidv4 = require('uuid/v4')

export class Edge implements IEdge {
  constructor(
    identifier: string,
    sourceId: string,
    targetId: string
  ) {
    this.id = uuidv4()
    this.identifier = identifier
    this.sourceId = sourceId
    this.targetId = targetId
  }
  id: string;
  identifier: string;
  sourceId: string;
  targetId: string;
}
import { IProgramState, IUseCase } from './interfaces'
const uuidv4 = require('uuid/v4')

export class ProgramState implements IProgramState {
  constructor(
    programName: string,
    projectId: string
  ) {
    this.id = uuidv4()
    this.projectId = projectId
    this.programName = 'programName'
    this.useCases = []
  }
  id: string;
  projectId: string;
  programName: string;
  useCases: IUseCase[];
}

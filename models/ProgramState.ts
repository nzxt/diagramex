import { IProgramState, IUseCase } from './interfaces'
const uuidv4 = require('uuid/v4')

export class ProgramState implements IProgramState {
  constructor(
    programName: string,
    projectId: string
  ) {
    this.programName = programName
    this.projectId = projectId
    this.useCases = []
  }
  projectId: string;
  programName: string;
  useCases: IUseCase[];
}

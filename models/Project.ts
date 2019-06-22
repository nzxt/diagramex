import { IProject, IProgramState } from './interfaces'
const uuidv4 = require('uuid/v4')

export class Project implements IProject {
  constructor(
    projectName: string
  ) {
    this.projectName = projectName
    this.userId = uuidv4()
    this.programs = []
  }
  projectName: string;
  userId: string;
  programs: IProgramState[];
}

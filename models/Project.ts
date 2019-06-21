import { IProject, IProgramState } from './interfaces'
const uuidv4 = require('uuid/v4')

export class Project implements IProject {
  constructor(
    projectName: string
  ) {
    this.id = uuidv4()
    this.projectName = projectName
    this.userId = uuidv4()
    this.programs = []
  }
  id: string;
  projectName: string;
  userId: string;
  programs: IProgramState[];
}

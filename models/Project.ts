import { IProject, IProgramState } from './interfaces'

export class Project implements IProject {
  constructor(
    projectName: string,
    userId: string
  ) {
    this.projectName = projectName
    this.userId = userId
    this.programs = []
  }
  projectName: string;
  userId: string;
  programs: IProgramState[];
}

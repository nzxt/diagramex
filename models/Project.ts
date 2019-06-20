import { IProject } from './interfaces'
const uuidv4 = require('uuid/v4')

export class Project implements IProject {
  constructor(
    projectName: string,
    userId: string,
    programs: Array<any>
  ) {
    this.id = uuidv4()
    this.projectName = projectName
    this.userId = userId
    this.programs = programs
  }
  id: string;
  projectName: string;
  userId:string;
  programs: Array <any>
}

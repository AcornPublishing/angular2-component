import Tag from './tag.js';
import {limitWithElipsis} from '../utilities/string-utilities.js';
import Project from '../project/project.js';
export const TAG_TYPE_PROJECT = 'project';

// The generateTag funtion is responsible for generating new tag objects depending on the passed subject
export function generateTag(subject) {
  if (subject.type === TAG_TYPE_PROJECT) {
    // If we're dealing with a project here, we generate the according tag object
    const project = subject;
    const openTaskCount = project.tasks.filter((task) => !task.done).length;
    return new Tag(
      `#${project._id}`,
      `${limitWithElipsis(project.title, 20)} (${openTaskCount} open tasks)`,
      `#/projects/${project._id}/tasks`,
      TAG_TYPE_PROJECT
    );
  }
}

import {Component, ViewEncapsulation, Inject, forwardRef} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import template from './task-list.html!text';
import Task from './task/task.js';
import EnterTask from './enter-task/enter-task.js';
import Project from '../project/project.js';
import Toggle from '../ui/toggle/toggle.js';

import DataProvider from '../../data-access/data-provider.js';
import LiveDocument from '../../data-access/live-document.js';

import ActivityService from '../activities/activity-service/activity-service.js';

@Component({
  selector: 'ngc-task-list',
  host: {
    'class': 'task-list'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Task, EnterTask, Toggle]
})
export default class TaskList {
  // TODO: Refactor and create a wrapper for resolving route instead of project injection
  constructor(@Inject(forwardRef(() => Project)) project, @Inject(ActivityService) activityService) {
    this.taskFilterList = ['all', 'open', 'done'];
    this.selectedTaskFilter = 'all';
    this.project = project;
    this.projectChangeSubscription = project.document.change.subscribe((data) => {
      this.tasks = data.tasks;
      this.taskFilterChange(this.selectedTaskFilter);
    });
    this.activityService = activityService;
  }

  taskFilterChange(filter) {
    this.selectedTaskFilter = filter;
    this.filteredTasks = this.tasks ? this.tasks.filter((task) => {
      if (filter === 'all') {
        return true;
      } else if (filter === 'open') {
        return !task.done;
      } else {
        return task.done;
      }
    }) : [];
  }

  // We use the reference of the old task to updated one specific item within the task list.
  onTaskUpdated(task, taskData) {
    const tasks = this.tasks.slice();
    tasks.splice(tasks.indexOf(task), 1, taskData);
    this.project.updateTasks(tasks);
    // Creating an activity log for the updated task
    this.activityService.logActivity(
      this.project.id,
      'tasks',
      'A task was updated',
      `An existing task was updated on the project #/projects/${this.project.id}/tasks.`
    );
  }

  // Using the reference of a task, this function will remove it from the tasks list and send an update
  onTaskDeleted(task) {
    const tasks = this.tasks.slice();
    tasks.splice(tasks.indexOf(task), 1);
    this.project.updateTasks(tasks);
    // Creating an activity log for the deleted task
    this.activityService.logActivity(
      this.project.id,
      'tasks',
      'A task was deleted',
      `A task was deleted from the project #/projects/${this.project.id}/tasks.`
    );
  }

  // Function to add a new task
  addTask(title) {
    const tasks = this.tasks.slice();
    tasks.splice(tasks.length, 0, {
      title,
      done: false
    });
    this.project.updateTasks(tasks);
    // Creating an activity log for the added task
    this.activityService.logActivity(
      this.project.id,
      'tasks',
      'A task was added',
      `A new task was added to the project #/projects/${this.project.id}/tasks.`
    );
  }

  ngOnDestroy() {
    this.projectChangeSubscription.unsubscribe();
  }
}

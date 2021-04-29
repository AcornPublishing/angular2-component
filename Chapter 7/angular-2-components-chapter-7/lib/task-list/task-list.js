import {Component, ViewEncapsulation, Inject, forwardRef} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import template from './task-list.html!text';
import Task from './task/task.js';
import EnterTask from './enter-task/enter-task.js';
import Project from '../project/project.js';
import Toggle from '../ui/toggle/toggle.js';

import ActivityService from '../activities/activity-service/activity-service.js';
import {limitWithElipsis} from '../utilities/string-utilities.js';

import {generateTag} from '../tags/generate-tag.js';

import Draggable from '../draggable/draggable.js';
import DraggableDropZone from '../draggable/draggable-drop-zone.js';

import InfiniteScroll from '../infinite-scroll/infinite-scroll.js';

@Component({
  selector: 'ngc-task-list',
  host: {
    'class': 'task-list'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Task, EnterTask, Toggle, Draggable, DraggableDropZone, InfiniteScroll]
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
  onTaskUpdated(task, updatedData) {
    const tasks = this.tasks.slice();
    const oldTask = tasks.splice(tasks.indexOf(task), 1, Object.assign({}, task, updatedData))[0];
    this.project.updateTasks(tasks);
    // Creating an activity log for the updated task
    this.activityService.logActivity(
      this.project.id,
      'tasks',
      'A task was updated',
      `The task "${limitWithElipsis(oldTask.title, 30)}" was updated on the project ${generateTag(this.project.document.data).textTag}.`
    );
  }

  // Using the reference of a task, this function will remove it from the tasks list and send an update
  onTaskDeleted(task) {
    const tasks = this.tasks.slice();
    const removed = tasks.splice(tasks.indexOf(task), 1)[0];
    this.project.updateTasks(tasks);
    // Creating an activity log for the deleted task
    this.activityService.logActivity(
      this.project.id,
      'tasks',
      'A task was deleted',
      `The task "${limitWithElipsis(removed.title, 30)}" was deleted from the project ${generateTag(this.project.document.data).textTag}.`
    );
  }

  // Function to add a new task
  addTask(title) {
    const tasks = this.tasks.slice();
    tasks.splice(tasks.length, 0, {
      position: tasks.length,
      title,
      done: false
    });
    this.project.updateTasks(tasks);
    // Creating an activity log for the added task
    this.activityService.logActivity(
      this.project.id,
      'tasks',
      'A task was added',
      `A new task "${limitWithElipsis(title, 30)}" was added to the project ${generateTag(this.project.document.data).textTag}.`
    );
  }

  onTaskDrop(source, target) {
    if (source.position === target.position) {
      return;
    }

    const tasks = this.tasks.slice();
    const sourceIndex = tasks.findIndex(
      (task) => task.position === source.position
    );
    const targetIndex = tasks.findIndex(
      (task) => task.position === target.position
    );
    tasks.splice(targetIndex, 0, tasks.splice(sourceIndex, 1)[0]);
    tasks = tasks.map((task, index) => {
      return Object.assign({}, task, {
        position: index
      });
    });
    this.project.updateTasks(tasks);

    this.activityService.logActivity(
      this.project.id,
      'tasks',
      'A task was moved',
      `The task "${limitWithElipsis(source.title, 30)}" of the project ${generateTag(this.project.document.data).textTag} was moved to the position ${target.position + 1}.`
    );
  }

  ngOnDestroy() {
    this.projectChangeSubscription.unsubscribe();
  }
}

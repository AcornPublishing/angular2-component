import {
  Component,
  NgFor,
  ViewEncapsulation,
  Inject} from 'angular2/angular2';

import template from './task-list.html!text';
// Task list service that provides our tasks
import TaskService from '../../data-access/task/task-service.js';
// The task component that displays each task
import Task from './task/task.js';
// The component for entering new tasks
import EnterTask from './enter-task/enter-task.js';
// We also need a Toggle UI component to provide a filter
import Toggle from '../ui/toggle/toggle.js';

@Component({
  selector: 'ngc-task-list',
  // We set the component class on the host
  // element so that we don't need to set
  // it manually where the host ist placed.
  host: {
    'class': 'task-list'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  // Set the TaskListService as host provider
  providers: [TaskService],
  // Specify all directives / components that are
  // used in the view
  directives: [Task, EnterTask, Toggle, NgFor]
})
export default class TaskList {
  // Inject the TaskListService and set our filter
  // data
  constructor(@Inject(TaskService) taskService) {
    this.taskService = taskService;
    this.taskFilterList = ['all', 'open', 'done'];
    this.selectedTaskFilter = 'all';
  }

  // Function that gets a filtered list of tasks based
  // on the selected task filter string.
  getFilteredTasks() {
    return this.taskService.getAllTasks().filter(task => {
      if (this.selectedTaskFilter === 'all') {
        return true;
      } else if (this.selectedTaskFilter === 'open') {
        return !task.done;
      } else {
        return task.done;
      }
    });
  }

  // Function to add a task from the view
  addTask(title) {
    this.taskService.tasks.push({
      title,
      done: false
    });
  }
}

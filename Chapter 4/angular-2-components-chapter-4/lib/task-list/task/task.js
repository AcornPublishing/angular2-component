import {Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, HostBinding} from 'angular2/angular2';
import template from './task.html!text';
// Each task has a checkbox component for marking tasks as done.
import Checkbox from '../../ui/checkbox/checkbox.js';

import Editor from '../../ui/editor/editor.js';

@Component({
  selector: 'ngc-task',
  host: {
    'class': 'task'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Checkbox, Editor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Task {
  @Input() title;
  @Input() @HostBinding('class.task--done') done;
  // We are using two event emitters for task updates and deletion
  @Output() taskUpdated = new EventEmitter();
  @Output() taskDeleted = new EventEmitter();

  // We use this function to update the checked state of our task
  markDone(checked) {
    this.done = checked;
    this.taskUpdated.next({
      title: this.title,
      done: this.done
    });
  }

  // If we want to delete this task we just emit an event and let the parent component deal with the rest
  deleteTask() {
    this.taskDeleted.next();
  }

  // When the editor is saved, we'll update the task and emit a taskUpdated event
  onEditSaved(content) {
    this.title = content;
    this.taskUpdated.next({
      title: this.title,
      done: this.done
    });
  }
}

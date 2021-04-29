import {Component, Inject, Optional, ViewEncapsulation} from 'angular2/core';
import template from './project.html!text';
import Tabs from '../ui/tabs/tabs.js';
import Tab from '../ui/tabs/tab/tab.js';
import TaskList from '../task-list/task-list.js';
import Comments from '../comments/comments.js';
import Activities from '../activities/activities.js';

import {RouteParams, RouteConfig, RouterOutlet, Route} from 'angular2/router';
import DataProvider from '../../data-access/data-provider.js';
import LiveDocument from '../../data-access/live-document.js';

// This component represents a project and displays project details
@Component({
  selector: 'ngc-project',
  host: {
    'class': 'project'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Tabs, Tab, TaskList, Comments]
})
@RouteConfig([
  new Route({ path: '/tasks', component: TaskList, name: 'TaskList', useAsDefault: true}),
  new Route({ path: '/comments', component: Comments, name: 'Comments'}),
  new Route({ path: '/activities', component: Activities, name: 'Activities'})
])
export default class Project {
  constructor(@Inject(RouteParams) routeParams, @Inject(DataProvider) dataProvider) {
    this.id = routeParams.get('projectId');
    this.document = new LiveDocument(dataProvider, {
      type: 'project',
      _id: this.id
    });
    this.document.change.subscribe((data) => {
      this.title = data.title;
      this.description = data.description;
    });

    this.tabItems = [
      {title: 'Tasks', link: ['./TaskList']},
      {title: 'Comments', link: ['./Comments']},
      {title: 'Activities', link: ['./Activities']}
    ];
  }

  // This function should be called if the task list of the project was updated
  updateTasks(tasks) {
    this.document.data.tasks = tasks;
    this.document.persist();
  }

  // This function should be called if the comments have been updated
  updateComments(comments) {
    this.document.data.comments = comments;
    this.document.persist();
  }

  ngOnDestroy() {
    this.document.unsubscribe();
  }
}

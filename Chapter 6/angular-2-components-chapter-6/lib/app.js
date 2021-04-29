import {Component, ViewEncapsulation, Inject} from 'angular2/core';
import DataProvider from '../data-access/data-provider.js';
import template from './app.html!text';
import Project from './project/project.js';
import Navigation from './navigation/navigation.js';
import NavigationSection from './navigation/navigation-section/navigation-section.js';
import NavigationItem from './navigation/navigation-section/navigation-item/navigation-item.js';
import UserService from './user/user-service/user-service.js';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import ActivityService from './activities/activity-service/activity-service.js';

// Our main application component will be responsible for fetching project data and rendering the main application components.
@Component({
  selector: 'ngc-app',
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Project, Navigation, NavigationSection, NavigationItem, RouterOutlet],
  providers: [DataProvider, UserService, ActivityService]
})
@RouteConfig([
  { path: '/projects/:projectId/...', component: Project, as: 'ProjectDetails' }
])
export default class App {
  // We use the data provider to obtain a data change observer
  constructor(@Inject(DataProvider) dataProvider) {
    this.dataProvider = dataProvider;
    this.projects = [];

    // Setting up our functional reactive subscription to receive project changes from the database
    this.projectsSubscription = this.dataProvider.getLiveChanges()
      // First convert the change records to actual documents
      .map((change) => change.doc)
      // Filter so that we only receive project documents
      .filter((document) => document.type === 'project')
      // Finally we subscribe to the change observer and deal with project changes in the function parameter
      .subscribe((changedProject) => {
        // On every project change we need to update our projects list as well as sort it by title
        const projectIndex = this.projects.findIndex((project) => project._id === changedProject._id);
        if (projectIndex === -1) {
          this.projects.push(changedProject);
        } else {
          this.projects.splice(projectIndex, 1, changedProject);
        }
        this.projects.sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0);

        this.projectNavigationItems = this.projects
          .filter((project) => !project.deleted)
          .map((project) => {
            return {
              title: project.title,
              link: ['/ProjectDetails', {projectId: project._id}]
            };
          });
      });
  }

  // Uses functional reduce to get a count over open tasks across all projects
  getOpenTasksCount() {
    return this.projects.reduce((count, project) => count + project.tasks.filter((task) => !task.done).length, 0);
  }

  // If this component gets destroyed, we need to remember to clean up the project subscription
  ngOnDestroy() {
    this.projectsSubscription.unsubscribe();
  }
}

import {Component, Inject, ViewEncapsulation, ViewChild, forwardRef} from 'angular2/core';
import template from './comments.html!text';
import Editor from '../ui/editor/editor.js';
import Comment from './comment/comment.js';
import Project from '../project/project.js';
import UserService from '../user/user-service/user-service.js';

import ActivityService from '../activities/activity-service/activity-service.js';
import {limitWithElipsis} from '../utilities/string-utilities.js';

import {generateTag} from '../tags/generate-tag.js';

import InfiniteScroll from '../infinite-scroll/infinite-scroll.js';

@Component({
  selector: 'ngc-comments',
  host: {
    'class': 'comments'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Comment, Editor, InfiniteScroll]
})
export default class Comments {
  // We are using an editor for adding new comments and control it directly using a reference
  @ViewChild(Editor) newCommentEditor;

  // We're using the user service to obtain the currently logged in user
  // TODO: Refactor and create a wrapper for resolving route instead of project injection
  constructor(@Inject(UserService) userService, @Inject(forwardRef(() => Project)) project, @Inject(ActivityService) activityService) {
    this.userService = userService;
    this.activityService = activityService;
    this.project = project;
    this.projectChangeSubscription = project.document.change.subscribe((data) => {
      this.comments = data.comments;
    });
  }

  // Adding a new comment from the newCommentContent field that is bound to the editor content
  addNewComment() {
    const comments = this.comments ? this.comments.slice() : [];
    const content = this.newCommentEditor.getEditableContent();
    comments.splice(0, 0, {
      user: this.userService.currentUser,
      time: +new Date(),
      content
    });
    this.project.updateComments(comments);
    // We reset the content of the editor
    this.newCommentEditor.setEditableContent('');
    // Creating an activity log for the added comment
    this.activityService.logActivity(
      this.project.id,
      'comments',
      'New comment was added',
      `A new comment "${limitWithElipsis(content, 30)}" was added to the project ${generateTag(this.project.document.data).textTag}.`
    );
  }

  // This method deals with edited comments
  onCommentEdited(comment, content) {
    const comments = this.comments.slice();
    // If the comment was edited with e zero length content, we will delete the comment from the list
    if (content.length === 0) {
      const removed = comments.splice(comments.indexOf(comment), 1)[0];
      // Creating an activity log for the deleted comment
      this.activityService.logActivity(
        this.project.id,
        'comments',
        'Comment deleted',
        `The comment "${limitWithElipsis(removed.content, 30)}" on the project ${generateTag(this.project.document.data).textTag} was deleted.`
      );
    } else {
      // Otherwise we're replacing the existing comment
      const oldComment = comments.splice(comments.indexOf(comment), 1, {
        user: comment.user,
        time: comment.time,
        content
      })[0];
      // Creating an activity log for the modified comment
      this.activityService.logActivity(
        this.project.id,
        'comments',
        'Comment edited',
        `The comment "${limitWithElipsis(oldComment.content, 30)}" on the project ${generateTag(this.project.document.data).textTag} was edited.`
      );
    }
    // Emit event so the updated comment list can be persisted outside the component
    this.project.updateComments(comments);
  }

  isNewCommentEmpty() {
    return this.newCommentEditor ? this.newCommentEditor.getEditableContent().length === 0 : true;
  }

  hasComments() {
    return this.comments && this.comments.length > 0;
  }

  ngOnDestroy() {
    this.projectChangeSubscription.unsubscribe();
  }
}

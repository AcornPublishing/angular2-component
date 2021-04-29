import {Component, ViewEncapsulation, ViewChild, Inject, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import template from './comments.html!text';
import Editor from '../ui/editor/editor.js';
import Comment from './comment/comment.js';
import UserService from '../user/user-service/user-service.js';

@Component({
  selector: 'ngc-comments',
  host: {
    'class': 'comments'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [Comment, Editor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Comments {
  // A list of comment objects
  @Input() comments;
  // Event when the list of comments have been updated
  @Output() commentsUpdated = new EventEmitter();
  // We are using an editor for adding new comments and control it directly using a reference
  @ViewChild(Editor) newCommentEditor;

  // We're using the user service to obtain the currently logged in user
  constructor(@Inject(UserService) userService) {
    this.userService = userService;
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
    this.commentsUpdated.next(comments);
    // We reset the content of the editor
    this.newCommentEditor.setEditableContent('');
  }

  // This method deals with edited comments
  onCommentEdited(comment, content) {
    const comments = this.comments.slice();
    // If the comment was edited with e zero length content, we will delete the comment from the list
    if (content.length === 0) {
      comments.splice(comments.indexOf(comment), 1)[0];
    } else {
      // Otherwise we're replacing the existing comment
      comments.splice(comments.indexOf(comment), 1, {
        user: comment.user,
        time: comment.time,
        content
      })[0];
    }
    // Emit event so the updated comment list can be persisted outside the component
    this.commentsUpdated.next(comments);
  }

  isNewCommentEmpty() {
    return this.newCommentEditor ? this.newCommentEditor.getEditableContent().length === 0 : true;
  }

  hasComments() {
    return this.comments && this.comments.length > 0;
  }
}

import {Component, Inject, NgFor, NgIf, Input, Output, ViewEncapsulation, ViewChild, EventEmitter} from 'angular2/angular2';
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
  directives: [NgFor, NgIf, Comment, Editor]
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

  // We use input change tracking to prevent dealing with undefined comment list
  onChanges(changes) {
    if (changes.comments && changes.comments.currentValue === undefined) {
      this.comments = [];
    }
  }

  // Adding a new comment from the newCommentContent field that is bound to the editor content
  addNewComment() {
    const comments = this.comments.slice();
    comments.splice(0, 0, {
      user: this.userService.currentUser,
      time: +new Date(),
      content: this.newCommentEditor.getEditableContent()
    });
    // Emit event so the updated comment list can be persisted outside the component
    this.commentsUpdated.next(comments);
    // We reset the content of the editor
    this.newCommentEditor.setEditableContent('');
  }

  // This method deals with edited comments
  onCommentEdited(comment, content) {
    const comments = this.comments.slice();
    // If the comment was edited with e zero length content, we will delete the comment from the list
    if (content.length === 0) {
      comments.splice(comments.indexOf(comment), 1);
    } else {
      // Otherwise we're replacing the existing comment
      comments.splice(comments.indexOf(comment), 1, {
        user: comment.user,
        time: comment.time,
        content
      });
    }
    // Emit event so the updated comment list can be persisted outside the component
    this.commentsUpdated.next(comments);
  }
}

import {Component, Input, Output, ViewEncapsulation, EventEmitter, ElementRef, Inject, HostBinding, HostListener} from 'angular2/core';
import template from './editor.html!text';
import Tags from '../../pipes/tags.js';
import TagsSelect from '../../tags/tags-select/tags-select.js';
import TagInputManager from '../../tags/tag-input-manager.js';

@Component({
  selector: 'ngc-editor',
  host: {
    'class': 'editor'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  pipes: [Tags],
  directives: [TagsSelect]
})
export default class Editor {
  // Content that will be edited and displayed
  @Input() content;
  // Creating a host element class attribute binding from the editMode property
  @Input() @HostBinding('class.editor--edit-mode') editMode;
  @Input() showControls;
  // Specify if the editor should handle tags
  @Input() enableTags;
  @Output() editSaved = new EventEmitter();
  @Output() editableInput = new EventEmitter();

  // We use ElementRef in order to obtain our editable element for later use
  constructor(@Inject(ElementRef) elementRef) {
    this.editableContentElement = elementRef.nativeElement.querySelector('.editor__editable-content');
    // We're using a TagInputManager to help us dealing with tag creation
    this.tagInputManager = new TagInputManager();
  }

  // We need to make sure to reflect to our editable element if content gets updated from outside
  ngOnChanges(changes) {
    if (changes.content) {
      this.setEditableContent(changes.content.currentValue);
    }
  }

  // This returns the content of our content editable
  getEditableContent() {
    return this.editableContentElement.textContent;
  }

  // This sets the content of our content editable
  setEditableContent(content) {
    this.editableContentElement.textContent = content;
  }

  // This annotation will create a click event listener on the host element that will invoke the underlying method
  @HostListener('click')
  focusEditableContent() {
    if (this.editMode) {
      this.editableContentElement.focus();
    }
  }

  // Method that will be invoked if our editable element is changed
  onInput() {
    // Emit a editableInput event with the edited content
    this.editableInput.next(this.getEditableContent());
  }

  // This method is called when the editable element receives a keydown event
  onKeyDown(event) {
    // We're delegating the keydown event to the TagInputManager
    this.tagInputManager.onKeyDown(event);
  }

  // This method is called when the editable element receives a keypress event
  onKeyPress(event) {
    // We're delegating the keypress event to the TagInputManager
    this.tagInputManager.onKeyPress(event);
  }

  // This method is called if the child TagSelect component is emitting an event for a selected tag
  onTagSelected(tag) {
    // We replace the partial text tag within the editor with the text representation of the tag that was selected in the TagSelect component.
    this.setEditableContent(this.getEditableContent().replace(this.tagInputManager.textTag, tag.textTag));
    this.tagInputManager.reset();
  }

  // On save we reflect the content of the editable element into the content field and emit an event
  save() {
    this.content = this.getEditableContent();
    this.editSaved.next(this.content);
    // Setting editMode to false to switch the editor back to viewing mode
    this.editMode = false;
    // We also reset the tag manager as we should cancel any active tag entering
    this.tagInputManager.reset();
  }

  // Canceling the edit will not reflect the edited content and switch back to viewing mode
  cancel() {
    this.setEditableContent(this.content);
    this.editableInput.next(this.getEditableContent());
    this.editMode = false;
    // We also reset the tag manager as we should cancel any active tag entering
    this.tagInputManager.reset();
  }

  // The edit method will initialize the editable element and set the component into edit mode
  edit() {
    this.editMode = true;
  }
}

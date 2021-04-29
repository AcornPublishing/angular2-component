/* */ 
"format cjs";
import { By } from 'angular2/platform/browser';
import { Scope } from 'angular2/core';
var debugElement;
class MyDirective {
}
// #docregion by_all
debugElement.query(By.all(), Scope.all);
// #enddocregion
// #docregion by_css
debugElement.query(By.css('[attribute]'), Scope.all);
// #enddocregion
// #docregion by_directive
debugElement.query(By.directive(MyDirective), Scope.all);
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9leGFtcGxlcy9wbGF0Zm9ybS9kb20vZGVidWcvdHMvYnkvYnkudHMiXSwibmFtZXMiOlsiTXlEaXJlY3RpdmUiXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sMkJBQTJCO09BQ3JDLEVBQWUsS0FBSyxFQUFDLE1BQU0sZUFBZTtBQUVqRCxJQUFJLFlBQTBCLENBQUM7QUFDL0I7QUFBbUJBLENBQUNBO0FBRXBCLG9CQUFvQjtBQUNwQixZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQWdCO0FBRWhCLG9CQUFvQjtBQUNwQixZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELGdCQUFnQjtBQUVoQiwwQkFBMEI7QUFDMUIsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0J5fSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyJztcbmltcG9ydCB7RGVidWdFbGVtZW50LCBTY29wZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbnZhciBkZWJ1Z0VsZW1lbnQ6IERlYnVnRWxlbWVudDtcbmNsYXNzIE15RGlyZWN0aXZlIHt9XG5cbi8vICNkb2NyZWdpb24gYnlfYWxsXG5kZWJ1Z0VsZW1lbnQucXVlcnkoQnkuYWxsKCksIFNjb3BlLmFsbCk7XG4vLyAjZW5kZG9jcmVnaW9uXG5cbi8vICNkb2NyZWdpb24gYnlfY3NzXG5kZWJ1Z0VsZW1lbnQucXVlcnkoQnkuY3NzKCdbYXR0cmlidXRlXScpLCBTY29wZS5hbGwpO1xuLy8gI2VuZGRvY3JlZ2lvblxuXG4vLyAjZG9jcmVnaW9uIGJ5X2RpcmVjdGl2ZVxuZGVidWdFbGVtZW50LnF1ZXJ5KEJ5LmRpcmVjdGl2ZShNeURpcmVjdGl2ZSksIFNjb3BlLmFsbCk7XG4vLyAjZW5kZG9jcmVnaW9uXG4iXX0=
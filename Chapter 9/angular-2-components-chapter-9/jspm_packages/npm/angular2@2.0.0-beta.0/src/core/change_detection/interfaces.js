/* */ 
'use strict';var DebugContext = (function () {
    function DebugContext(element, componentElement, directive, context, locals, injector) {
        this.element = element;
        this.componentElement = componentElement;
        this.directive = directive;
        this.context = context;
        this.locals = locals;
        this.injector = injector;
    }
    return DebugContext;
})();
exports.DebugContext = DebugContext;
var ChangeDetectorGenConfig = (function () {
    function ChangeDetectorGenConfig(genDebugInfo, logBindingUpdate, useJit) {
        this.genDebugInfo = genDebugInfo;
        this.logBindingUpdate = logBindingUpdate;
        this.useJit = useJit;
    }
    return ChangeDetectorGenConfig;
})();
exports.ChangeDetectorGenConfig = ChangeDetectorGenConfig;
var ChangeDetectorDefinition = (function () {
    function ChangeDetectorDefinition(id, strategy, variableNames, bindingRecords, eventRecords, directiveRecords, genConfig) {
        this.id = id;
        this.strategy = strategy;
        this.variableNames = variableNames;
        this.bindingRecords = bindingRecords;
        this.eventRecords = eventRecords;
        this.directiveRecords = directiveRecords;
        this.genConfig = genConfig;
    }
    return ChangeDetectorDefinition;
})();
exports.ChangeDetectorDefinition = ChangeDetectorDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6WyJEZWJ1Z0NvbnRleHQiLCJEZWJ1Z0NvbnRleHQuY29uc3RydWN0b3IiLCJDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZyIsIkNoYW5nZURldGVjdG9yR2VuQ29uZmlnLmNvbnN0cnVjdG9yIiwiQ2hhbmdlRGV0ZWN0b3JEZWZpbml0aW9uIiwiQ2hhbmdlRGV0ZWN0b3JEZWZpbml0aW9uLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiQUFNQTtJQUNFQSxzQkFBbUJBLE9BQVlBLEVBQVNBLGdCQUFxQkEsRUFBU0EsU0FBY0EsRUFDakVBLE9BQVlBLEVBQVNBLE1BQVdBLEVBQVNBLFFBQWFBO1FBRHREQyxZQUFPQSxHQUFQQSxPQUFPQSxDQUFLQTtRQUFTQSxxQkFBZ0JBLEdBQWhCQSxnQkFBZ0JBLENBQUtBO1FBQVNBLGNBQVNBLEdBQVRBLFNBQVNBLENBQUtBO1FBQ2pFQSxZQUFPQSxHQUFQQSxPQUFPQSxDQUFLQTtRQUFTQSxXQUFNQSxHQUFOQSxNQUFNQSxDQUFLQTtRQUFTQSxhQUFRQSxHQUFSQSxRQUFRQSxDQUFLQTtJQUFHQSxDQUFDQTtJQUMvRUQsbUJBQUNBO0FBQURBLENBQUNBLEFBSEQsSUFHQztBQUhZLG9CQUFZLGVBR3hCLENBQUE7QUErQkQ7SUFDRUUsaUNBQW1CQSxZQUFxQkEsRUFBU0EsZ0JBQXlCQSxFQUN2REEsTUFBZUE7UUFEZkMsaUJBQVlBLEdBQVpBLFlBQVlBLENBQVNBO1FBQVNBLHFCQUFnQkEsR0FBaEJBLGdCQUFnQkEsQ0FBU0E7UUFDdkRBLFdBQU1BLEdBQU5BLE1BQU1BLENBQVNBO0lBQUdBLENBQUNBO0lBQ3hDRCw4QkFBQ0E7QUFBREEsQ0FBQ0EsQUFIRCxJQUdDO0FBSFksK0JBQXVCLDBCQUduQyxDQUFBO0FBRUQ7SUFDRUUsa0NBQW1CQSxFQUFVQSxFQUFTQSxRQUFpQ0EsRUFDcERBLGFBQXVCQSxFQUFTQSxjQUErQkEsRUFDL0RBLFlBQTZCQSxFQUFTQSxnQkFBbUNBLEVBQ3pFQSxTQUFrQ0E7UUFIbENDLE9BQUVBLEdBQUZBLEVBQUVBLENBQVFBO1FBQVNBLGFBQVFBLEdBQVJBLFFBQVFBLENBQXlCQTtRQUNwREEsa0JBQWFBLEdBQWJBLGFBQWFBLENBQVVBO1FBQVNBLG1CQUFjQSxHQUFkQSxjQUFjQSxDQUFpQkE7UUFDL0RBLGlCQUFZQSxHQUFaQSxZQUFZQSxDQUFpQkE7UUFBU0EscUJBQWdCQSxHQUFoQkEsZ0JBQWdCQSxDQUFtQkE7UUFDekVBLGNBQVNBLEdBQVRBLFNBQVNBLENBQXlCQTtJQUFHQSxDQUFDQTtJQUMzREQsK0JBQUNBO0FBQURBLENBQUNBLEFBTEQsSUFLQztBQUxZLGdDQUF3QiwyQkFLcEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TG9jYWxzfSBmcm9tICcuL3BhcnNlci9sb2NhbHMnO1xuaW1wb3J0IHtCaW5kaW5nVGFyZ2V0LCBCaW5kaW5nUmVjb3JkfSBmcm9tICcuL2JpbmRpbmdfcmVjb3JkJztcbmltcG9ydCB7RGlyZWN0aXZlSW5kZXgsIERpcmVjdGl2ZVJlY29yZH0gZnJvbSAnLi9kaXJlY3RpdmVfcmVjb3JkJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJy4vY2hhbmdlX2RldGVjdG9yX3JlZic7XG5cbmV4cG9ydCBjbGFzcyBEZWJ1Z0NvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogYW55LCBwdWJsaWMgY29tcG9uZW50RWxlbWVudDogYW55LCBwdWJsaWMgZGlyZWN0aXZlOiBhbnksXG4gICAgICAgICAgICAgIHB1YmxpYyBjb250ZXh0OiBhbnksIHB1YmxpYyBsb2NhbHM6IGFueSwgcHVibGljIGluamVjdG9yOiBhbnkpIHt9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlRGlzcGF0Y2hlciB7XG4gIGdldERlYnVnQ29udGV4dChlbGVtZW50SW5kZXg6IG51bWJlciwgZGlyZWN0aXZlSW5kZXg6IERpcmVjdGl2ZUluZGV4KTogRGVidWdDb250ZXh0O1xuICBub3RpZnlPbkJpbmRpbmcoYmluZGluZ1RhcmdldDogQmluZGluZ1RhcmdldCwgdmFsdWU6IGFueSk6IHZvaWQ7XG4gIGxvZ0JpbmRpbmdVcGRhdGUoYmluZGluZ1RhcmdldDogQmluZGluZ1RhcmdldCwgdmFsdWU6IGFueSk6IHZvaWQ7XG4gIG5vdGlmeUFmdGVyQ29udGVudENoZWNrZWQoKTogdm9pZDtcbiAgbm90aWZ5QWZ0ZXJWaWV3Q2hlY2tlZCgpOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZURldGVjdG9yIHtcbiAgcGFyZW50OiBDaGFuZ2VEZXRlY3RvcjtcbiAgbW9kZTogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3k7XG4gIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWY7XG5cbiAgYWRkQ29udGVudENoaWxkKGNkOiBDaGFuZ2VEZXRlY3Rvcik6IHZvaWQ7XG4gIGFkZFZpZXdDaGlsZChjZDogQ2hhbmdlRGV0ZWN0b3IpOiB2b2lkO1xuICByZW1vdmVDb250ZW50Q2hpbGQoY2Q6IENoYW5nZURldGVjdG9yKTogdm9pZDtcbiAgcmVtb3ZlVmlld0NoaWxkKGNkOiBDaGFuZ2VEZXRlY3Rvcik6IHZvaWQ7XG4gIHJlbW92ZSgpOiB2b2lkO1xuICBoeWRyYXRlKGNvbnRleHQ6IGFueSwgbG9jYWxzOiBMb2NhbHMsIGRpcmVjdGl2ZXM6IGFueSwgcGlwZXM6IGFueSk6IHZvaWQ7XG4gIGRlaHlkcmF0ZSgpOiB2b2lkO1xuICBtYXJrUGF0aFRvUm9vdEFzQ2hlY2tPbmNlKCk6IHZvaWQ7XG5cbiAgaGFuZGxlRXZlbnQoZXZlbnROYW1lOiBzdHJpbmcsIGVsSW5kZXg6IG51bWJlciwgbG9jYWxzOiBMb2NhbHMpO1xuICBkZXRlY3RDaGFuZ2VzKCk6IHZvaWQ7XG4gIGNoZWNrTm9DaGFuZ2VzKCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvdG9DaGFuZ2VEZXRlY3RvciB7IGluc3RhbnRpYXRlKGRpc3BhdGNoZXI6IENoYW5nZURpc3BhdGNoZXIpOiBDaGFuZ2VEZXRlY3RvcjsgfVxuXG5leHBvcnQgY2xhc3MgQ2hhbmdlRGV0ZWN0b3JHZW5Db25maWcge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2VuRGVidWdJbmZvOiBib29sZWFuLCBwdWJsaWMgbG9nQmluZGluZ1VwZGF0ZTogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIHVzZUppdDogYm9vbGVhbikge31cbn1cblxuZXhwb3J0IGNsYXNzIENoYW5nZURldGVjdG9yRGVmaW5pdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgc3RyYXRlZ3k6IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgICAgICAgICAgICBwdWJsaWMgdmFyaWFibGVOYW1lczogc3RyaW5nW10sIHB1YmxpYyBiaW5kaW5nUmVjb3JkczogQmluZGluZ1JlY29yZFtdLFxuICAgICAgICAgICAgICBwdWJsaWMgZXZlbnRSZWNvcmRzOiBCaW5kaW5nUmVjb3JkW10sIHB1YmxpYyBkaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSxcbiAgICAgICAgICAgICAgcHVibGljIGdlbkNvbmZpZzogQ2hhbmdlRGV0ZWN0b3JHZW5Db25maWcpIHt9XG59XG4iXX0=
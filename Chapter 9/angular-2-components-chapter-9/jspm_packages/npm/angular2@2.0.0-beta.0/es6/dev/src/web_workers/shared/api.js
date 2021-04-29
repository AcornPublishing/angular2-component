/* */ 
"format cjs";
import { CONST_EXPR } from "angular2/src/facade/lang";
import { OpaqueToken } from "angular2/src/core/di";
export const ON_WEB_WORKER = CONST_EXPR(new OpaqueToken('WebWorker.onWebWorker'));
export class WebWorkerElementRef {
    constructor(renderView, boundElementIndex) {
        this.renderView = renderView;
        this.boundElementIndex = boundElementIndex;
    }
}
export class WebWorkerTemplateCmd {
    visit(visitor, context) { return null; }
}
export class WebWorkerTextCmd {
    constructor(isBound, ngContentIndex, value) {
        this.isBound = isBound;
        this.ngContentIndex = ngContentIndex;
        this.value = value;
    }
    visit(visitor, context) {
        return visitor.visitText(this, context);
    }
}
export class WebWorkerNgContentCmd {
    constructor(index, ngContentIndex) {
        this.index = index;
        this.ngContentIndex = ngContentIndex;
    }
    visit(visitor, context) {
        return visitor.visitNgContent(this, context);
    }
}
export class WebWorkerBeginElementCmd {
    constructor(isBound, ngContentIndex, name, attrNameAndValues, eventTargetAndNames) {
        this.isBound = isBound;
        this.ngContentIndex = ngContentIndex;
        this.name = name;
        this.attrNameAndValues = attrNameAndValues;
        this.eventTargetAndNames = eventTargetAndNames;
    }
    visit(visitor, context) {
        return visitor.visitBeginElement(this, context);
    }
}
export class WebWorkerEndElementCmd {
    visit(visitor, context) {
        return visitor.visitEndElement(context);
    }
}
export class WebWorkerBeginComponentCmd {
    constructor(isBound, ngContentIndex, name, attrNameAndValues, eventTargetAndNames, templateId) {
        this.isBound = isBound;
        this.ngContentIndex = ngContentIndex;
        this.name = name;
        this.attrNameAndValues = attrNameAndValues;
        this.eventTargetAndNames = eventTargetAndNames;
        this.templateId = templateId;
    }
    visit(visitor, context) {
        return visitor.visitBeginComponent(this, context);
    }
}
export class WebWorkerEndComponentCmd {
    visit(visitor, context) {
        return visitor.visitEndComponent(context);
    }
}
export class WebWorkerEmbeddedTemplateCmd {
    constructor(isBound, ngContentIndex, name, attrNameAndValues, eventTargetAndNames, isMerged, children) {
        this.isBound = isBound;
        this.ngContentIndex = ngContentIndex;
        this.name = name;
        this.attrNameAndValues = attrNameAndValues;
        this.eventTargetAndNames = eventTargetAndNames;
        this.isMerged = isMerged;
        this.children = children;
    }
    visit(visitor, context) {
        return visitor.visitEmbeddedTemplate(this, context);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9hcGkudHMiXSwibmFtZXMiOlsiV2ViV29ya2VyRWxlbWVudFJlZiIsIldlYldvcmtlckVsZW1lbnRSZWYuY29uc3RydWN0b3IiLCJXZWJXb3JrZXJUZW1wbGF0ZUNtZCIsIldlYldvcmtlclRlbXBsYXRlQ21kLnZpc2l0IiwiV2ViV29ya2VyVGV4dENtZCIsIldlYldvcmtlclRleHRDbWQuY29uc3RydWN0b3IiLCJXZWJXb3JrZXJUZXh0Q21kLnZpc2l0IiwiV2ViV29ya2VyTmdDb250ZW50Q21kIiwiV2ViV29ya2VyTmdDb250ZW50Q21kLmNvbnN0cnVjdG9yIiwiV2ViV29ya2VyTmdDb250ZW50Q21kLnZpc2l0IiwiV2ViV29ya2VyQmVnaW5FbGVtZW50Q21kIiwiV2ViV29ya2VyQmVnaW5FbGVtZW50Q21kLmNvbnN0cnVjdG9yIiwiV2ViV29ya2VyQmVnaW5FbGVtZW50Q21kLnZpc2l0IiwiV2ViV29ya2VyRW5kRWxlbWVudENtZCIsIldlYldvcmtlckVuZEVsZW1lbnRDbWQudmlzaXQiLCJXZWJXb3JrZXJCZWdpbkNvbXBvbmVudENtZCIsIldlYldvcmtlckJlZ2luQ29tcG9uZW50Q21kLmNvbnN0cnVjdG9yIiwiV2ViV29ya2VyQmVnaW5Db21wb25lbnRDbWQudmlzaXQiLCJXZWJXb3JrZXJFbmRDb21wb25lbnRDbWQiLCJXZWJXb3JrZXJFbmRDb21wb25lbnRDbWQudmlzaXQiLCJXZWJXb3JrZXJFbWJlZGRlZFRlbXBsYXRlQ21kIiwiV2ViV29ya2VyRW1iZWRkZWRUZW1wbGF0ZUNtZC5jb25zdHJ1Y3RvciIsIldlYldvcmtlckVtYmVkZGVkVGVtcGxhdGVDbWQudmlzaXQiXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMEJBQTBCO09BQzVDLEVBQUMsV0FBVyxFQUFDLE1BQU0sc0JBQXNCO0FBYWhELGFBQWEs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QSxPQUE2QkEsRUFBRUEsT0FBWUE7UUFDL0NDLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLGlCQUFpQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7SUFDNUNBLENBQUNBO0FBQ0hELENBQUNBO0FBRUQ7SUFDRUUsWUFBbUJBLE9BQWdCQSxFQUFTQSxjQUFzQkEsRUFBU0EsSUFBWUEsRUFDcEVBLGlCQUEyQkEsRUFBU0EsbUJBQTZCQSxFQUNqRUEsUUFBaUJBLEVBQVNBLFFBQTZCQTtRQUZ2REMsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBU0E7UUFBU0EsbUJBQWNBLEdBQWRBLGNBQWNBLENBQVFBO1FBQVNBLFNBQUlBLEdBQUpBLElBQUlBLENBQVFBO1FBQ3BFQSxzQkFBaUJBLEdBQWpCQSxpQkFBaUJBLENBQVVBO1FBQVNBLHdCQUFtQkEsR0FBbkJBLG1CQUFtQkEsQ0FBVUE7UUFDakVBLGFBQVFBLEdBQVJBLFFBQVFBLENBQVNBO1FBQVNBLGFBQVFBLEdBQVJBLFFBQVFBLENBQXFCQTtJQUFHQSxDQUFDQTtJQUM5RUQsS0FBS0EsQ0FBQ0EsT0FBNkJBLEVBQUVBLE9BQVlBO1FBQy9DRSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxxQkFBcUJBLENBQUNBLElBQUlBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBO0lBQ3REQSxDQUFDQTtBQUNIRixDQUFDQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT05TVF9FWFBSfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nXCI7XG5pbXBvcnQge09wYXF1ZVRva2VufSBmcm9tIFwiYW5ndWxhcjIvc3JjL2NvcmUvZGlcIjtcbmltcG9ydCB7XG4gIFJlbmRlckVsZW1lbnRSZWYsXG4gIFJlbmRlclZpZXdSZWYsXG4gIFJlbmRlclRlbXBsYXRlQ21kLFxuICBSZW5kZXJUZXh0Q21kLFxuICBSZW5kZXJOZ0NvbnRlbnRDbWQsXG4gIFJlbmRlckJlZ2luRWxlbWVudENtZCxcbiAgUmVuZGVyQmVnaW5Db21wb25lbnRDbWQsXG4gIFJlbmRlckVtYmVkZGVkVGVtcGxhdGVDbWQsXG4gIFJlbmRlckNvbW1hbmRWaXNpdG9yXG59IGZyb20gXCJhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpXCI7XG5cbmV4cG9ydCBjb25zdCBPTl9XRUJfV09SS0VSID0gQ09OU1RfRVhQUihuZXcgT3BhcXVlVG9rZW4oJ1dlYldvcmtlci5vbldlYldvcmtlcicpKTtcblxuZXhwb3J0IGNsYXNzIFdlYldvcmtlckVsZW1lbnRSZWYgaW1wbGVtZW50cyBSZW5kZXJFbGVtZW50UmVmIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlbmRlclZpZXc6IFJlbmRlclZpZXdSZWYsIHB1YmxpYyBib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgV2ViV29ya2VyVGVtcGxhdGVDbWQgaW1wbGVtZW50cyBSZW5kZXJUZW1wbGF0ZUNtZCB7XG4gIHZpc2l0KHZpc2l0b3I6IFJlbmRlckNvbW1hbmRWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViV29ya2VyVGV4dENtZCBpbXBsZW1lbnRzIFJlbmRlclRleHRDbWQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgaXNCb3VuZDogYm9vbGVhbiwgcHVibGljIG5nQ29udGVudEluZGV4OiBudW1iZXIsIHB1YmxpYyB2YWx1ZTogc3RyaW5nKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBSZW5kZXJDb21tYW5kVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYldvcmtlck5nQ29udGVudENtZCBpbXBsZW1lbnRzIFJlbmRlck5nQ29udGVudENtZCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmRleDogbnVtYmVyLCBwdWJsaWMgbmdDb250ZW50SW5kZXg6IG51bWJlcikge31cbiAgdmlzaXQodmlzaXRvcjogUmVuZGVyQ29tbWFuZFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXROZ0NvbnRlbnQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYldvcmtlckJlZ2luRWxlbWVudENtZCBpbXBsZW1lbnRzIFJlbmRlckJlZ2luRWxlbWVudENtZCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpc0JvdW5kOiBib29sZWFuLCBwdWJsaWMgbmdDb250ZW50SW5kZXg6IG51bWJlciwgcHVibGljIG5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHVibGljIGF0dHJOYW1lQW5kVmFsdWVzOiBzdHJpbmdbXSwgcHVibGljIGV2ZW50VGFyZ2V0QW5kTmFtZXM6IHN0cmluZ1tdKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBSZW5kZXJDb21tYW5kVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEJlZ2luRWxlbWVudCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViV29ya2VyRW5kRWxlbWVudENtZCBpbXBsZW1lbnRzIFJlbmRlclRlbXBsYXRlQ21kIHtcbiAgdmlzaXQodmlzaXRvcjogUmVuZGVyQ29tbWFuZFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbmRFbGVtZW50KGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJXb3JrZXJCZWdpbkNvbXBvbmVudENtZCBpbXBsZW1lbnRzIFJlbmRlckJlZ2luQ29tcG9uZW50Q21kIHtcbiAgY29uc3RydWN0b3IocHVibGljIGlzQm91bmQ6IGJvb2xlYW4sIHB1YmxpYyBuZ0NvbnRlbnRJbmRleDogbnVtYmVyLCBwdWJsaWMgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICBwdWJsaWMgYXR0ck5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdLCBwdWJsaWMgZXZlbnRUYXJnZXRBbmROYW1lczogc3RyaW5nW10sXG4gICAgICAgICAgICAgIHB1YmxpYyB0ZW1wbGF0ZUlkOiBzdHJpbmcpIHt9XG4gIHZpc2l0KHZpc2l0b3I6IFJlbmRlckNvbW1hbmRWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmVnaW5Db21wb25lbnQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYldvcmtlckVuZENvbXBvbmVudENtZCBpbXBsZW1lbnRzIFJlbmRlclRlbXBsYXRlQ21kIHtcbiAgdmlzaXQodmlzaXRvcjogUmVuZGVyQ29tbWFuZFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbmRDb21wb25lbnQoY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYldvcmtlckVtYmVkZGVkVGVtcGxhdGVDbWQgaW1wbGVtZW50cyBSZW5kZXJFbWJlZGRlZFRlbXBsYXRlQ21kIHtcbiAgY29uc3RydWN0b3IocHVibGljIGlzQm91bmQ6IGJvb2xlYW4sIHB1YmxpYyBuZ0NvbnRlbnRJbmRleDogbnVtYmVyLCBwdWJsaWMgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICBwdWJsaWMgYXR0ck5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdLCBwdWJsaWMgZXZlbnRUYXJnZXRBbmROYW1lczogc3RyaW5nW10sXG4gICAgICAgICAgICAgIHB1YmxpYyBpc01lcmdlZDogYm9vbGVhbiwgcHVibGljIGNoaWxkcmVuOiBSZW5kZXJUZW1wbGF0ZUNtZFtdKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBSZW5kZXJDb21tYW5kVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEVtYmVkZGVkVGVtcGxhdGUodGhpcywgY29udGV4dCk7XG4gIH1cbn1cbiJdfQ==
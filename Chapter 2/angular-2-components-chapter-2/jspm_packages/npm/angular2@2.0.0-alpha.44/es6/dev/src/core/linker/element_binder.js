/* */ 
"format cjs";
import { isBlank } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
export class ElementBinder {
    constructor(index, parent, distanceToParent, protoElementInjector, componentDirective, nestedProtoView) {
        this.index = index;
        this.parent = parent;
        this.distanceToParent = distanceToParent;
        this.protoElementInjector = protoElementInjector;
        this.componentDirective = componentDirective;
        this.nestedProtoView = nestedProtoView;
        if (isBlank(index)) {
            throw new BaseException('null index not allowed.');
        }
    }
}
//# sourceMappingURL=element_binder.js.map
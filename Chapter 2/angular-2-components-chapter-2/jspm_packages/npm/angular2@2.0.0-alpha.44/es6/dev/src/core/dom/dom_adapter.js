/* */ 
"format cjs";
import { isBlank } from 'angular2/src/core/facade/lang';
export var DOM;
export function setRootDomAdapter(adapter) {
    if (isBlank(DOM)) {
        DOM = adapter;
    }
}
/* tslint:disable:requireParameterType */
/**
 * Provides DOM operations in an environment-agnostic way.
 */
export class DomAdapter {
}
//# sourceMappingURL=dom_adapter.js.map
/* */ 
"format cjs";
import { merge as mergeStatic } from './merge-static';
export function merge(...observables) {
    observables.unshift(this);
    return mergeStatic.apply(this, observables);
}
//# sourceMappingURL=merge.js.map
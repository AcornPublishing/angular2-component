/* */ 
"format cjs";
import { zip } from './zip-static';
export function zipProto(...observables) {
    observables.unshift(this);
    return zip.apply(this, observables);
}
//# sourceMappingURL=zip.js.map
/* */ 
"format cjs";
import { ArrayObservable } from '../observable/fromArray';
import { ZipOperator } from './zip-support';
export function zip(...observables) {
    const project = observables[observables.length - 1];
    if (typeof project === 'function') {
        observables.pop();
    }
    return new ArrayObservable(observables).lift(new ZipOperator(project));
}
//# sourceMappingURL=zip-static.js.map
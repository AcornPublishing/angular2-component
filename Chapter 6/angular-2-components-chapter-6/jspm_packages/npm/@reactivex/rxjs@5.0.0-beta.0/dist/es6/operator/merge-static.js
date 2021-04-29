/* */ 
"format cjs";
import { ArrayObservable } from '../observable/fromArray';
import { MergeAllOperator } from './mergeAll-support';
import { queue } from '../scheduler/queue';
import { isScheduler } from '../util/isScheduler';
export function merge(...observables) {
    let concurrent = Number.POSITIVE_INFINITY;
    let scheduler = queue;
    let last = observables[observables.length - 1];
    if (isScheduler(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    }
    else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (observables.length === 1) {
        return observables[0];
    }
    return new ArrayObservable(observables, scheduler).lift(new MergeAllOperator(concurrent));
}
//# sourceMappingURL=merge-static.js.map
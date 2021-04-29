/* */ 
"format cjs";
import { ArrayObservable } from '../observable/fromArray';
import { ScalarObservable } from '../observable/ScalarObservable';
import { EmptyObservable } from '../observable/empty';
import { concat } from './concat-static';
import { isScheduler } from '../util/isScheduler';
export function startWith(...array) {
    let scheduler = array[array.length - 1];
    if (isScheduler(scheduler)) {
        array.pop();
    }
    else {
        scheduler = void 0;
    }
    const len = array.length;
    if (len === 1) {
        return concat(new ScalarObservable(array[0], scheduler), this);
    }
    else if (len > 1) {
        return concat(new ArrayObservable(array, scheduler), this);
    }
    else {
        return concat(new EmptyObservable(scheduler), this);
    }
}
//# sourceMappingURL=startWith.js.map
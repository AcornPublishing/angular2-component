/* */ 
"format cjs";
import { ArrayObservable } from '../observable/fromArray';
import { CombineLatestOperator } from './combineLatest-support';
import { isScheduler } from '../util/isScheduler';
import { isArray } from '../util/isArray';
/**
 * Combines the values from observables passed as arguments. This is done by subscribing
 * to each observable, in order, and collecting an array of each of the most recent values any time any of the observables
 * emits, then either taking that array and passing it as arguments to an option `project` function and emitting the return
 * value of that, or just emitting the array of recent values directly if there is no `project` function.
 * @param {...Observable} observables the observables to combine
 * @param {function} [project] an optional function to project the values from the combined recent values into a new value for emission.
 * @returns {Observable} an observable of other projected values from the most recent values from each observable, or an array of each of
 * the most recent values from each observable.
 */
export function combineLatest(...observables) {
    let project = null;
    let scheduler = null;
    if (isScheduler(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray(observables[0])) {
        observables = observables[0];
    }
    return new ArrayObservable(observables, scheduler).lift(new CombineLatestOperator(project));
}
//# sourceMappingURL=combineLatest-static.js.map
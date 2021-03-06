/* */ 
"format cjs";
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * @param {Observable} observables the observables to get the latest values from.
 * @param {Function} [project] optional projection function for merging values together. Receives all values in order
 *  of observables passed. (e.g. `a.withLatestFrom(b, c, (a1, b1, c1) => a1 + b1 + c1)`). If this is not passed, arrays
 *  will be returned.
 * @description merges each value from an observable with the latest values from the other passed observables.
 * All observables must emit at least one value before the resulting observable will emit
 *
 * #### example
 * ```
 * A.withLatestFrom(B, C)
 *
 *  A:     ----a-----------------b---------------c-----------|
 *  B:     ---d----------------e--------------f---------|
 *  C:     --x----------------y-------------z-------------|
 * result: ---([a,d,x])---------([b,e,y])--------([c,f,z])---|
 * ```
 */
export function withLatestFrom(...args) {
    let project;
    if (typeof args[args.length - 1] === 'function') {
        project = args.pop();
    }
    const observables = args;
    return this.lift(new WithLatestFromOperator(observables, project));
}
class WithLatestFromOperator {
    constructor(observables, project) {
        this.observables = observables;
        this.project = project;
    }
    call(subscriber) {
        return new WithLatestFromSubscriber(subscriber, this.observables, this.project);
    }
}
class WithLatestFromSubscriber extends OuterSubscriber {
    constructor(destination, observables, project) {
        super(destination);
        this.observables = observables;
        this.project = project;
        this.toRespond = [];
        const len = observables.length;
        this.values = new Array(len);
        for (let i = 0; i < len; i++) {
            this.toRespond.push(i);
        }
        for (let i = 0; i < len; i++) {
            let observable = observables[i];
            this.add(subscribeToResult(this, observable, observable, i));
        }
    }
    notifyNext(observable, value, observableIndex, index) {
        this.values[observableIndex] = value;
        const toRespond = this.toRespond;
        if (toRespond.length > 0) {
            const found = toRespond.indexOf(observableIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    }
    notifyComplete() {
        // noop
    }
    _next(value) {
        if (this.toRespond.length === 0) {
            const values = this.values;
            const destination = this.destination;
            const project = this.project;
            const args = [value, ...values];
            if (project) {
                let result = tryCatch(this.project).apply(this, args);
                if (result === errorObject) {
                    destination.error(result.e);
                }
                else {
                    destination.next(result);
                }
            }
            else {
                destination.next(args);
            }
        }
    }
}
//# sourceMappingURL=withLatestFrom.js.map
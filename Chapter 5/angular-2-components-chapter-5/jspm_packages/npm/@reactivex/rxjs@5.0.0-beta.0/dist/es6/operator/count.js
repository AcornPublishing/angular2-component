/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
/**
 * Returns an observable of a single number that represents the number of items that either:
 * Match a provided predicate function, _or_ if a predicate is not provided, the number
 * represents the total count of all items in the source observable. The count is emitted
 * by the returned observable when the source observable completes.
 * @param {function} [predicate] a boolean function to select what values are to be counted.
 * it is provided with arguments of:
 *   - `value`: the value from the source observable
 *   - `index`: the "index" of the value from the source observable
 *   - `source`: the source observable instance itself.
 * @returns {Observable} an observable of one number that represents the count as described
 * above
 */
export function count(predicate) {
    return this.lift(new CountOperator(predicate, this));
}
class CountOperator {
    constructor(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    call(subscriber) {
        return new CountSubscriber(subscriber, this.predicate, this.source);
    }
}
class CountSubscriber extends Subscriber {
    constructor(destination, predicate, source) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.count = 0;
        this.index = 0;
    }
    _next(value) {
        const predicate = this.predicate;
        let passed = true;
        if (predicate) {
            passed = tryCatch(predicate)(value, this.index++, this.source);
            if (passed === errorObject) {
                this.destination.error(passed.e);
                return;
            }
        }
        if (passed) {
            this.count += 1;
        }
    }
    _complete() {
        this.destination.next(this.count);
        this.destination.complete();
    }
}
//# sourceMappingURL=count.js.map
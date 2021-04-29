/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
/**
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the returned observable
 *
 * @param {Function} project the function to create projection
 * @param {any} [thisArg] an optional argument to define what `this` is in the project function
 * @returns {Observable} a observable of projected values
 */
export function map(project, thisArg) {
    if (typeof project !== 'function') {
        throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
    }
    return this.lift(new MapOperator(project, thisArg));
}
class MapOperator {
    constructor(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    call(subscriber) {
        return new MapSubscriber(subscriber, this.project, this.thisArg);
    }
}
class MapSubscriber extends Subscriber {
    constructor(destination, project, thisArg) {
        super(destination);
        this.project = project;
        this.thisArg = thisArg;
        this.count = 0;
    }
    _next(x) {
        const result = tryCatch(this.project).call(this.thisArg || this, x, this.count++);
        if (result === errorObject) {
            this.error(errorObject.e);
        }
        else {
            this.destination.next(result);
        }
    }
}
//# sourceMappingURL=map.js.map
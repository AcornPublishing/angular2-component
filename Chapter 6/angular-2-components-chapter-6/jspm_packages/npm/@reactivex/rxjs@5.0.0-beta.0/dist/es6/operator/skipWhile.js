/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function skipWhile(predicate) {
    return this.lift(new SkipWhileOperator(predicate));
}
class SkipWhileOperator {
    constructor(predicate) {
        this.predicate = predicate;
    }
    call(subscriber) {
        return new SkipWhileSubscriber(subscriber, this.predicate);
    }
}
class SkipWhileSubscriber extends Subscriber {
    constructor(destination, predicate) {
        super(destination);
        this.predicate = predicate;
        this.skipping = true;
        this.index = 0;
    }
    _next(value) {
        const destination = this.destination;
        if (this.skipping === true) {
            const index = this.index++;
            const result = tryCatch(this.predicate)(value, index);
            if (result === errorObject) {
                destination.error(result.e);
            }
            else {
                this.skipping = Boolean(result);
            }
        }
        if (this.skipping === false) {
            destination.next(value);
        }
    }
}
//# sourceMappingURL=skipWhile.js.map
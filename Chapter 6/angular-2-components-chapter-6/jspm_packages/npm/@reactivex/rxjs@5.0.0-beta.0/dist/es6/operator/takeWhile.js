/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function takeWhile(predicate) {
    return this.lift(new TakeWhileOperator(predicate));
}
class TakeWhileOperator {
    constructor(predicate) {
        this.predicate = predicate;
    }
    call(subscriber) {
        return new TakeWhileSubscriber(subscriber, this.predicate);
    }
}
class TakeWhileSubscriber extends Subscriber {
    constructor(destination, predicate) {
        super(destination);
        this.predicate = predicate;
        this.index = 0;
    }
    _next(value) {
        const destination = this.destination;
        const result = tryCatch(this.predicate)(value, this.index++);
        if (result == errorObject) {
            destination.error(result.e);
        }
        else if (Boolean(result)) {
            destination.next(value);
        }
        else {
            destination.complete();
        }
    }
}
//# sourceMappingURL=takeWhile.js.map
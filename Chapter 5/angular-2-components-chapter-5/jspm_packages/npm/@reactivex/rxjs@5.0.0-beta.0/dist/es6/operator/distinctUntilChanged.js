/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function distinctUntilChanged(compare) {
    return this.lift(new DistinctUntilChangedOperator(compare));
}
class DistinctUntilChangedOperator {
    constructor(compare) {
        this.compare = compare;
    }
    call(subscriber) {
        return new DistinctUntilChangedSubscriber(subscriber, this.compare);
    }
}
class DistinctUntilChangedSubscriber extends Subscriber {
    constructor(destination, compare) {
        super(destination);
        this.hasValue = false;
        if (typeof compare === 'function') {
            this.compare = compare;
        }
    }
    compare(x, y) {
        return x === y;
    }
    _next(value) {
        let result = false;
        if (this.hasValue) {
            result = tryCatch(this.compare)(this.value, value);
            if (result === errorObject) {
                this.destination.error(errorObject.e);
                return;
            }
        }
        else {
            this.hasValue = true;
        }
        if (Boolean(result) === false) {
            this.value = value;
            this.destination.next(value);
        }
    }
}
//# sourceMappingURL=distinctUntilChanged.js.map
/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { ArgumentOutOfRangeError } from '../util/ArgumentOutOfRangeError';
import { EmptyObservable } from '../observable/empty';
export function take(total) {
    if (total === 0) {
        return new EmptyObservable();
    }
    else {
        return this.lift(new TakeOperator(total));
    }
}
class TakeOperator {
    constructor(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError;
        }
    }
    call(subscriber) {
        return new TakeSubscriber(subscriber, this.total);
    }
}
class TakeSubscriber extends Subscriber {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.count = 0;
    }
    _next(value) {
        const total = this.total;
        if (++this.count <= total) {
            this.destination.next(value);
            if (this.count === total) {
                this.destination.complete();
            }
        }
    }
}
//# sourceMappingURL=take.js.map
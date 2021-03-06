/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { ArgumentOutOfRangeError } from '../util/ArgumentOutOfRangeError';
export function elementAt(index, defaultValue) {
    return this.lift(new ElementAtOperator(index, defaultValue));
}
class ElementAtOperator {
    constructor(index, defaultValue) {
        this.index = index;
        this.defaultValue = defaultValue;
        if (index < 0) {
            throw new ArgumentOutOfRangeError;
        }
    }
    call(subscriber) {
        return new ElementAtSubscriber(subscriber, this.index, this.defaultValue);
    }
}
class ElementAtSubscriber extends Subscriber {
    constructor(destination, index, defaultValue) {
        super(destination);
        this.index = index;
        this.defaultValue = defaultValue;
    }
    _next(x) {
        if (this.index-- === 0) {
            this.destination.next(x);
            this.destination.complete();
        }
    }
    _complete() {
        const destination = this.destination;
        if (this.index >= 0) {
            if (typeof this.defaultValue !== 'undefined') {
                destination.next(this.defaultValue);
            }
            else {
                destination.error(new ArgumentOutOfRangeError);
            }
        }
        destination.complete();
    }
}
//# sourceMappingURL=elementAt.js.map
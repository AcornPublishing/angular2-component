/* */ 
"format cjs";
import { PromiseObservable } from '../observable/fromPromise';
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { isPromise } from '../util/isPromise';
import { errorObject } from '../util/errorObject';
export function throttle(durationSelector) {
    return this.lift(new ThrottleOperator(durationSelector));
}
class ThrottleOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(subscriber) {
        return new ThrottleSubscriber(subscriber, this.durationSelector);
    }
}
class ThrottleSubscriber extends Subscriber {
    constructor(destination, durationSelector) {
        super(destination);
        this.durationSelector = durationSelector;
    }
    _next(value) {
        if (!this.throttled) {
            const destination = this.destination;
            let duration = tryCatch(this.durationSelector)(value);
            if (duration === errorObject) {
                destination.error(errorObject.e);
                return;
            }
            if (isPromise(duration)) {
                duration = PromiseObservable.create(duration);
            }
            this.add(this.throttled = duration._subscribe(new ThrottleDurationSelectorSubscriber(this)));
            destination.next(value);
        }
    }
    _error(err) {
        this.clearThrottle();
        super._error(err);
    }
    _complete() {
        this.clearThrottle();
        super._complete();
    }
    clearThrottle() {
        const throttled = this.throttled;
        if (throttled) {
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    }
}
class ThrottleDurationSelectorSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
    }
    _next(unused) {
        this.parent.clearThrottle();
    }
    _error(err) {
        this.parent.error(err);
    }
    _complete() {
        this.parent.clearThrottle();
    }
}
//# sourceMappingURL=throttle.js.map
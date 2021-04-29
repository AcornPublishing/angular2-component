/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
export function sample(notifier) {
    return this.lift(new SampleOperator(notifier));
}
class SampleOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber) {
        return new SampleSubscriber(subscriber, this.notifier);
    }
}
class SampleSubscriber extends Subscriber {
    constructor(destination, notifier) {
        super(destination);
        this.notifier = notifier;
        this.hasValue = false;
        this.add(notifier._subscribe(new SampleNotificationSubscriber(this)));
    }
    _next(value) {
        this.lastValue = value;
        this.hasValue = true;
    }
    notifyNext() {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    }
}
class SampleNotificationSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
    }
    _next() {
        this.parent.notifyNext();
    }
    _error(err) {
        this.parent.error(err);
    }
    _complete() {
        this.parent.notifyNext();
    }
}
//# sourceMappingURL=sample.js.map
/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
export function inspect(notifier) {
    return this.lift(new InspectOperator(notifier));
}
class InspectOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber) {
        return new InspectSubscriber(subscriber, this.notifier);
    }
}
class InspectSubscriber extends Subscriber {
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
        //noop
    }
}
//# sourceMappingURL=inspect.js.map
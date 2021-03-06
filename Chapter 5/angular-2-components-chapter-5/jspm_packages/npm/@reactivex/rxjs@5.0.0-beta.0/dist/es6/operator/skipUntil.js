/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
export function skipUntil(notifier) {
    return this.lift(new SkipUntilOperator(notifier));
}
class SkipUntilOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber) {
        return new SkipUntilSubscriber(subscriber, this.notifier);
    }
}
class SkipUntilSubscriber extends Subscriber {
    constructor(destination, notifier) {
        super(destination);
        this.notifier = notifier;
        this.notificationSubscriber = null;
        this.notificationSubscriber = new NotificationSubscriber(this);
        this.add(this.notifier.subscribe(this.notificationSubscriber));
    }
    _next(value) {
        if (this.notificationSubscriber.hasValue) {
            this.destination.next(value);
        }
    }
    _error(err) {
        this.destination.error(err);
    }
    _complete() {
        if (this.notificationSubscriber.hasCompleted) {
            this.destination.complete();
        }
        this.notificationSubscriber.unsubscribe();
    }
    unsubscribe() {
        if (this._isUnsubscribed) {
            return;
        }
        else if (this._subscription) {
            this._subscription.unsubscribe();
            this._isUnsubscribed = true;
        }
        else {
            super.unsubscribe();
        }
    }
}
class NotificationSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
        this.hasValue = false;
        this.hasCompleted = false;
    }
    _next(unused) {
        this.hasValue = true;
    }
    _error(err) {
        this.parent.error(err);
        this.hasValue = true;
    }
    _complete() {
        this.hasCompleted = true;
    }
}
//# sourceMappingURL=skipUntil.js.map
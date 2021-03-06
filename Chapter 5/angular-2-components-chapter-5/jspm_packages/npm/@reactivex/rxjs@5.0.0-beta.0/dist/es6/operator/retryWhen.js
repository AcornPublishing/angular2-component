/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { Subject } from '../Subject';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function retryWhen(notifier) {
    return this.lift(new RetryWhenOperator(notifier, this));
}
class RetryWhenOperator {
    constructor(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    call(subscriber) {
        return new FirstRetryWhenSubscriber(subscriber, this.notifier, this.source);
    }
}
class FirstRetryWhenSubscriber extends Subscriber {
    constructor(destination, notifier, source) {
        super();
        this.destination = destination;
        this.notifier = notifier;
        this.source = source;
        destination.add(this);
        this.lastSubscription = this;
    }
    _next(value) {
        this.destination.next(value);
    }
    error(err) {
        const destination = this.destination;
        if (!this.isUnsubscribed) {
            super.unsubscribe();
            if (!this.retryNotifications) {
                this.errors = new Subject();
                const notifications = tryCatch(this.notifier).call(this, this.errors);
                if (notifications === errorObject) {
                    destination.error(errorObject.e);
                }
                else {
                    this.retryNotifications = notifications;
                    const notificationSubscriber = new RetryNotificationSubscriber(this);
                    this.notificationSubscription = notifications.subscribe(notificationSubscriber);
                    destination.add(this.notificationSubscription);
                }
            }
            this.errors.next(err);
        }
    }
    destinationError(err) {
        this.tearDown();
        this.destination.error(err);
    }
    _complete() {
        this.destinationComplete();
    }
    destinationComplete() {
        this.tearDown();
        this.destination.complete();
    }
    unsubscribe() {
        const lastSubscription = this.lastSubscription;
        if (lastSubscription === this) {
            super.unsubscribe();
        }
        else {
            this.tearDown();
        }
    }
    tearDown() {
        super.unsubscribe();
        this.lastSubscription.unsubscribe();
        const notificationSubscription = this.notificationSubscription;
        if (notificationSubscription) {
            notificationSubscription.unsubscribe();
        }
    }
    resubscribe() {
        const { destination, lastSubscription } = this;
        destination.remove(lastSubscription);
        lastSubscription.unsubscribe();
        const nextSubscriber = new MoreRetryWhenSubscriber(this);
        this.lastSubscription = this.source.subscribe(nextSubscriber);
        destination.add(this.lastSubscription);
    }
}
class MoreRetryWhenSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
    }
    _next(value) {
        this.parent.destination.next(value);
    }
    _error(err) {
        this.parent.errors.next(err);
    }
    _complete() {
        this.parent.destinationComplete();
    }
}
class RetryNotificationSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
    }
    _next(value) {
        this.parent.resubscribe();
    }
    _error(err) {
        this.parent.destinationError(err);
    }
    _complete() {
        this.parent.destinationComplete();
    }
}
//# sourceMappingURL=retryWhen.js.map
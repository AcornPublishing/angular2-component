/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
export function retry(count = 0) {
    return this.lift(new RetryOperator(count, this));
}
class RetryOperator {
    constructor(count, source) {
        this.count = count;
        this.source = source;
    }
    call(subscriber) {
        return new FirstRetrySubscriber(subscriber, this.count, this.source);
    }
}
class FirstRetrySubscriber extends Subscriber {
    constructor(destination, count, source) {
        super();
        this.destination = destination;
        this.count = count;
        this.source = source;
        destination.add(this);
        this.lastSubscription = this;
    }
    _next(value) {
        this.destination.next(value);
    }
    error(error) {
        if (!this.isUnsubscribed) {
            this.unsubscribe();
            this.resubscribe();
        }
    }
    _complete() {
        this.unsubscribe();
        this.destination.complete();
    }
    resubscribe(retried = 0) {
        const { lastSubscription, destination } = this;
        destination.remove(lastSubscription);
        lastSubscription.unsubscribe();
        const nextSubscriber = new RetryMoreSubscriber(this, this.count, retried + 1);
        this.lastSubscription = this.source.subscribe(nextSubscriber);
        destination.add(this.lastSubscription);
    }
}
class RetryMoreSubscriber extends Subscriber {
    constructor(parent, count, retried = 0) {
        super(null);
        this.parent = parent;
        this.count = count;
        this.retried = retried;
    }
    _next(value) {
        this.parent.destination.next(value);
    }
    _error(err) {
        const parent = this.parent;
        const retried = this.retried;
        const count = this.count;
        if (count && retried === count) {
            parent.destination.error(err);
        }
        else {
            parent.resubscribe(retried);
        }
    }
    _complete() {
        this.parent.destination.complete();
    }
}
//# sourceMappingURL=retry.js.map
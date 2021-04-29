/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { EmptyObservable } from '../observable/empty';
export function repeat(count = -1) {
    if (count === 0) {
        return new EmptyObservable();
    }
    else {
        return this.lift(new RepeatOperator(count, this));
    }
}
class RepeatOperator {
    constructor(count, source) {
        this.count = count;
        this.source = source;
    }
    call(subscriber) {
        return new FirstRepeatSubscriber(subscriber, this.count, this.source);
    }
}
class FirstRepeatSubscriber extends Subscriber {
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
    _error(err) {
        this.destination.error(err);
    }
    complete() {
        if (!this.isUnsubscribed) {
            this.resubscribe(this.count);
        }
    }
    unsubscribe() {
        const lastSubscription = this.lastSubscription;
        if (lastSubscription === this) {
            super.unsubscribe();
        }
        else {
            lastSubscription.unsubscribe();
        }
    }
    resubscribe(count) {
        const { destination, lastSubscription } = this;
        destination.remove(lastSubscription);
        lastSubscription.unsubscribe();
        if (count - 1 === 0) {
            destination.complete();
        }
        else {
            const nextSubscriber = new MoreRepeatSubscriber(this, count - 1);
            this.lastSubscription = this.source.subscribe(nextSubscriber);
            destination.add(this.lastSubscription);
        }
    }
}
class MoreRepeatSubscriber extends Subscriber {
    constructor(parent, count) {
        super();
        this.parent = parent;
        this.count = count;
    }
    _next(value) {
        this.parent.destination.next(value);
    }
    _error(err) {
        this.parent.destination.error(err);
    }
    _complete() {
        const count = this.count;
        this.parent.resubscribe(count < 0 ? -1 : count);
    }
}
//# sourceMappingURL=repeat.js.map
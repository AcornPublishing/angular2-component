/* */ 
"format cjs";
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
export function exhaust() {
    return this.lift(new SwitchFirstOperator());
}
class SwitchFirstOperator {
    call(subscriber) {
        return new SwitchFirstSubscriber(subscriber);
    }
}
class SwitchFirstSubscriber extends OuterSubscriber {
    constructor(destination) {
        super(destination);
        this.hasSubscription = false;
        this.hasCompleted = false;
    }
    _next(value) {
        if (!this.hasSubscription) {
            this.hasSubscription = true;
            this.add(subscribeToResult(this, value));
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue) {
        this.destination.next(innerValue);
    }
    notifyError(err) {
        this.destination.error(err);
    }
    notifyComplete(innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=exhaust.js.map
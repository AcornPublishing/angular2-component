/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { asap } from '../scheduler/asap';
export function inspectTime(delay, scheduler = asap) {
    return this.lift(new InspectTimeOperator(delay, scheduler));
}
class InspectTimeOperator {
    constructor(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    call(subscriber) {
        return new InspectTimeSubscriber(subscriber, this.delay, this.scheduler);
    }
}
class InspectTimeSubscriber extends Subscriber {
    constructor(destination, delay, scheduler) {
        super(destination);
        this.delay = delay;
        this.scheduler = scheduler;
        this.hasValue = false;
        this.add(scheduler.schedule(dispatchNotification, delay, { subscriber: this, delay }));
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
function dispatchNotification(state) {
    let { subscriber, delay } = state;
    subscriber.notifyNext();
    this.schedule(state, delay);
}
//# sourceMappingURL=inspectTime.js.map
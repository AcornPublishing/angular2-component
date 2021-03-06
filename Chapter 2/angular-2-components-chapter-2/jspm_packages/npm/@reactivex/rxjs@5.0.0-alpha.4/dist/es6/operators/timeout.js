/* */ 
"format cjs";
import Subscriber from '../Subscriber';
import immediate from '../schedulers/immediate';
import isDate from '../util/isDate';
export default function timeout(due, errorToSend = null, scheduler = immediate) {
    let absoluteTimeout = isDate(due);
    let waitFor = absoluteTimeout ? (+due - scheduler.now()) : due;
    return this.lift(new TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler));
}
class TimeoutOperator {
    constructor(waitFor, absoluteTimeout, errorToSend, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.errorToSend = errorToSend;
        this.scheduler = scheduler;
    }
    call(subscriber) {
        return new TimeoutSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.errorToSend, this.scheduler);
    }
}
class TimeoutSubscriber extends Subscriber {
    constructor(destination, absoluteTimeout, waitFor, errorToSend, scheduler) {
        super(destination);
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.errorToSend = errorToSend;
        this.scheduler = scheduler;
        this.index = 0;
        this._previousIndex = 0;
        this._hasCompleted = false;
        this.scheduleTimeout();
    }
    get previousIndex() {
        return this._previousIndex;
    }
    get hasCompleted() {
        return this._hasCompleted;
    }
    static dispatchTimeout(state) {
        const source = state.subscriber;
        const currentIndex = state.index;
        if (!source.hasCompleted && source.previousIndex === currentIndex) {
            source.notifyTimeout();
        }
    }
    scheduleTimeout() {
        let currentIndex = this.index;
        this.scheduler.schedule(TimeoutSubscriber.dispatchTimeout, this.waitFor, { subscriber: this, index: currentIndex });
        this.index++;
        this._previousIndex = currentIndex;
    }
    _next(value) {
        this.destination.next(value);
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
    }
    _error(err) {
        this.destination.error(err);
        this._hasCompleted = true;
    }
    _complete() {
        this.destination.complete();
        this._hasCompleted = true;
    }
    notifyTimeout() {
        this.error(this.errorToSend || new Error('timeout'));
    }
}

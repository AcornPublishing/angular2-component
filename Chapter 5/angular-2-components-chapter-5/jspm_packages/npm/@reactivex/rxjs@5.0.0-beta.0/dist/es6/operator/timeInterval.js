/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { queue } from '../scheduler/queue';
export function timeInterval(scheduler = queue) {
    return this.lift(new TimeIntervalOperator(scheduler));
}
export class TimeInterval {
    constructor(value, interval) {
        this.value = value;
        this.interval = interval;
    }
}
;
class TimeIntervalOperator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }
    call(observer) {
        return new TimeIntervalSubscriber(observer, this.scheduler);
    }
}
class TimeIntervalSubscriber extends Subscriber {
    constructor(destination, scheduler) {
        super(destination);
        this.scheduler = scheduler;
        this.lastTime = 0;
        this.lastTime = scheduler.now();
    }
    _next(value) {
        let now = this.scheduler.now();
        let span = now - this.lastTime;
        this.lastTime = now;
        this.destination.next(new TimeInterval(value, span));
    }
}
//# sourceMappingURL=timeInterval.js.map
/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
export function skip(total) {
    return this.lift(new SkipOperator(total));
}
class SkipOperator {
    constructor(total) {
        this.total = total;
    }
    call(subscriber) {
        return new SkipSubscriber(subscriber, this.total);
    }
}
class SkipSubscriber extends Subscriber {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.count = 0;
    }
    _next(x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    }
}
//# sourceMappingURL=skip.js.map
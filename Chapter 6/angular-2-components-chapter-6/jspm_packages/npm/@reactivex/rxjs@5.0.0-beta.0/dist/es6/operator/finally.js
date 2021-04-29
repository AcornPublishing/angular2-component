/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { Subscription } from '../Subscription';
export function _finally(finallySelector) {
    return this.lift(new FinallyOperator(finallySelector));
}
class FinallyOperator {
    constructor(finallySelector) {
        this.finallySelector = finallySelector;
    }
    call(subscriber) {
        return new FinallySubscriber(subscriber, this.finallySelector);
    }
}
class FinallySubscriber extends Subscriber {
    constructor(destination, finallySelector) {
        super(destination);
        this.add(new Subscription(finallySelector));
    }
}
//# sourceMappingURL=finally.js.map
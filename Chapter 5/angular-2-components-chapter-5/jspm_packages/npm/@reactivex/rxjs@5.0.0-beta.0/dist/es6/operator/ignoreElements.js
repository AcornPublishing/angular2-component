/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { noop } from '../util/noop';
export function ignoreElements() {
    return this.lift(new IgnoreElementsOperator());
}
;
class IgnoreElementsOperator {
    call(subscriber) {
        return new IgnoreElementsSubscriber(subscriber);
    }
}
class IgnoreElementsSubscriber extends Subscriber {
    _next(unused) {
        noop();
    }
}
//# sourceMappingURL=ignoreElements.js.map
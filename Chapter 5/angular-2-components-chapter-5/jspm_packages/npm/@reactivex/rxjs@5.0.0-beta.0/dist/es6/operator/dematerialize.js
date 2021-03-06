/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
export function dematerialize() {
    return this.lift(new DeMaterializeOperator());
}
class DeMaterializeOperator {
    call(subscriber) {
        return new DeMaterializeSubscriber(subscriber);
    }
}
class DeMaterializeSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
    }
    _next(value) {
        value.observe(this.destination);
    }
}
//# sourceMappingURL=dematerialize.js.map
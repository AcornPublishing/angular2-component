/* */ 
"format cjs";
import { Subscriber } from './Subscriber';
export class InnerSubscriber extends Subscriber {
    constructor(parent, outerValue, outerIndex) {
        super();
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    _next(value) {
        const index = this.index++;
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, index);
    }
    _error(error) {
        this.parent.notifyError(error, this);
    }
    _complete() {
        this.parent.notifyComplete(this);
    }
}
//# sourceMappingURL=InnerSubscriber.js.map
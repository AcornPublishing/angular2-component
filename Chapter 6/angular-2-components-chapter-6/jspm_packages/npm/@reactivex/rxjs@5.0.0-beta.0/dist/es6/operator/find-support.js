/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export class FindValueOperator {
    constructor(predicate, source, yieldIndex, thisArg) {
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
    }
    call(observer) {
        return new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg);
    }
}
export class FindValueSubscriber extends Subscriber {
    constructor(destination, predicate, source, yieldIndex, thisArg) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
        this.index = 0;
    }
    notifyComplete(value) {
        const destination = this.destination;
        destination.next(value);
        destination.complete();
    }
    _next(value) {
        const { predicate, thisArg } = this;
        const index = this.index++;
        const result = tryCatch(predicate).call(thisArg || this, value, index, this.source);
        if (result === errorObject) {
            this.destination.error(result.e);
        }
        else if (result) {
            this.notifyComplete(this.yieldIndex ? index : value);
        }
    }
    _complete() {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    }
}
//# sourceMappingURL=find-support.js.map
/* */ 
"format cjs";
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
export class MergeAllOperator {
    constructor(concurrent) {
        this.concurrent = concurrent;
    }
    call(observer) {
        return new MergeAllSubscriber(observer, this.concurrent);
    }
}
export class MergeAllSubscriber extends OuterSubscriber {
    constructor(destination, concurrent) {
        super(destination);
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
    }
    _next(observable) {
        if (this.active < this.concurrent) {
            if (observable._isScalar) {
                this.destination.next(observable.value);
            }
            else {
                this.active++;
                this.add(subscribeToResult(this, observable));
            }
        }
        else {
            this.buffer.push(observable);
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=mergeAll-support.js.map
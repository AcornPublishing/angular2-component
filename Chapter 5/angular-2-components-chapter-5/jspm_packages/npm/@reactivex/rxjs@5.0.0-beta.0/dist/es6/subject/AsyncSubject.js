/* */ 
"format cjs";
import { Subject } from '../Subject';
export class AsyncSubject extends Subject {
    constructor() {
        super();
        this._value = void 0;
        this._hasNext = false;
        this._isScalar = false;
    }
    _subscribe(subscriber) {
        if (this.completeSignal && this._hasNext) {
            subscriber.next(this._value);
        }
        return super._subscribe(subscriber);
    }
    _next(value) {
        this._value = value;
        this._hasNext = true;
    }
    _complete() {
        let index = -1;
        const observers = this.observers;
        const len = observers.length;
        // optimization -- block next, complete, and unsubscribe while dispatching
        this.observers = void 0; // optimization
        this.isUnsubscribed = true;
        if (this._hasNext) {
            while (++index < len) {
                let o = observers[index];
                o.next(this._value);
                o.complete();
            }
        }
        else {
            while (++index < len) {
                observers[index].complete();
            }
        }
        this.isUnsubscribed = false;
    }
}
//# sourceMappingURL=AsyncSubject.js.map
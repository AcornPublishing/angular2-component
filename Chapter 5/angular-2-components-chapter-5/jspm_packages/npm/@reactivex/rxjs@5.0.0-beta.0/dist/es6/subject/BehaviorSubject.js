/* */ 
"format cjs";
import { Subject } from '../Subject';
import { throwError } from '../util/throwError';
import { ObjectUnsubscribedError } from '../util/ObjectUnsubscribedError';
export class BehaviorSubject extends Subject {
    constructor(_value) {
        super();
        this._value = _value;
        this._hasError = false;
    }
    getValue() {
        if (this._hasError) {
            throwError(this._err);
        }
        else if (this.isUnsubscribed) {
            throwError(new ObjectUnsubscribedError());
        }
        else {
            return this._value;
        }
    }
    get value() {
        return this.getValue();
    }
    _subscribe(subscriber) {
        const subscription = super._subscribe(subscriber);
        if (!subscription) {
            return;
        }
        else if (!subscription.isUnsubscribed) {
            subscriber.next(this._value);
        }
        return subscription;
    }
    _next(value) {
        super._next(this._value = value);
    }
    _error(err) {
        this._hasError = true;
        super._error(this._err = err);
    }
}
//# sourceMappingURL=BehaviorSubject.js.map
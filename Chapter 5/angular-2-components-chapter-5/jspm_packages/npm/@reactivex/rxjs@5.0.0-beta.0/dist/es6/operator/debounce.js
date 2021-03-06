/* */ 
"format cjs";
import { PromiseObservable } from '../observable/fromPromise';
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { isPromise } from '../util/isPromise';
import { errorObject } from '../util/errorObject';
export function debounce(durationSelector) {
    return this.lift(new DebounceOperator(durationSelector));
}
class DebounceOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(observer) {
        return new DebounceSubscriber(observer, this.durationSelector);
    }
}
class DebounceSubscriber extends Subscriber {
    constructor(destination, durationSelector) {
        super(destination);
        this.durationSelector = durationSelector;
        this.debouncedSubscription = null;
        this.lastValue = null;
        this._index = 0;
    }
    get index() {
        return this._index;
    }
    _next(value) {
        const destination = this.destination;
        const currentIndex = ++this._index;
        let debounce = tryCatch(this.durationSelector)(value);
        if (debounce === errorObject) {
            destination.error(errorObject.e);
        }
        else {
            if (isPromise(debounce)) {
                debounce = PromiseObservable.create(debounce);
            }
            this.lastValue = value;
            this.clearDebounce();
            this.add(this.debouncedSubscription = debounce._subscribe(new DurationSelectorSubscriber(this, currentIndex)));
        }
    }
    _complete() {
        this.debouncedNext();
        this.destination.complete();
    }
    debouncedNext() {
        this.clearDebounce();
        if (this.lastValue != null) {
            this.destination.next(this.lastValue);
            this.lastValue = null;
        }
    }
    clearDebounce() {
        const debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription) {
            debouncedSubscription.unsubscribe();
            this.remove(debouncedSubscription);
            this.debouncedSubscription = null;
        }
    }
}
class DurationSelectorSubscriber extends Subscriber {
    constructor(parent, currentIndex) {
        super(null);
        this.parent = parent;
        this.currentIndex = currentIndex;
    }
    debounceNext() {
        const parent = this.parent;
        if (this.currentIndex === parent.index) {
            parent.debouncedNext();
            if (!this.isUnsubscribed) {
                this.unsubscribe();
            }
        }
    }
    _next(unused) {
        this.debounceNext();
    }
    _error(err) {
        this.parent.error(err);
    }
    _complete() {
        this.debounceNext();
    }
}
//# sourceMappingURL=debounce.js.map
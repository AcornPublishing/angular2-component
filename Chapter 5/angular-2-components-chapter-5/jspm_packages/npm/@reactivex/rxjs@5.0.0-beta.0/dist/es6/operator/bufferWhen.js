/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
/**
 * Opens a buffer immediately, then closes the buffer when the observable returned by calling `closingSelector` emits a value.
 * It that immediately opens a new buffer and repeats the process
 * @param {function} a function that takes no arguments and returns an Observable that signals buffer closure
 * @returns {Observable<T[]>} an observable of arrays of buffered values.
 */
export function bufferWhen(closingSelector) {
    return this.lift(new BufferWhenOperator(closingSelector));
}
class BufferWhenOperator {
    constructor(closingSelector) {
        this.closingSelector = closingSelector;
    }
    call(subscriber) {
        return new BufferWhenSubscriber(subscriber, this.closingSelector);
    }
}
class BufferWhenSubscriber extends Subscriber {
    constructor(destination, closingSelector) {
        super(destination);
        this.closingSelector = closingSelector;
        this.openBuffer();
    }
    _next(value) {
        this.buffer.push(value);
    }
    _error(err) {
        this.buffer = null;
        this.destination.error(err);
    }
    _complete() {
        const buffer = this.buffer;
        this.destination.next(buffer);
        this.buffer = null;
        this.destination.complete();
    }
    openBuffer() {
        const prevClosingNotification = this.closingNotification;
        if (prevClosingNotification) {
            this.remove(prevClosingNotification);
            prevClosingNotification.unsubscribe();
        }
        const buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        let closingNotifier = tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject) {
            const err = closingNotifier.e;
            this.buffer = null;
            this.destination.error(err);
        }
        else {
            this.add(this.closingNotification = closingNotifier._subscribe(new BufferClosingNotifierSubscriber(this)));
        }
    }
}
class BufferClosingNotifierSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
    }
    _next() {
        this.parent.openBuffer();
    }
    _error(err) {
        this.parent.error(err);
    }
    _complete() {
        this.parent.openBuffer();
    }
}
//# sourceMappingURL=bufferWhen.js.map
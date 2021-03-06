/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
/**
 * buffers the incoming observable values until the passed `closingNotifier` emits a value, at which point
 * it emits the buffer on the returned observable and starts a new buffer internally, awaiting the
 * next time `closingNotifier` emits
 *
 * @param {Observable<any>} closingNotifier an observable, that signals the buffer to be emitted} from the returned observable
 * @returns {Observable<T[]>} an observable of buffers, which are arrays of values
 */
export function buffer(closingNotifier) {
    return this.lift(new BufferOperator(closingNotifier));
}
class BufferOperator {
    constructor(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    call(subscriber) {
        return new BufferSubscriber(subscriber, this.closingNotifier);
    }
}
class BufferSubscriber extends Subscriber {
    constructor(destination, closingNotifier) {
        super(destination);
        this.buffer = [];
        this.notifierSubscriber = null;
        this.notifierSubscriber = new BufferClosingNotifierSubscriber(this);
        this.add(closingNotifier._subscribe(this.notifierSubscriber));
    }
    _next(value) {
        this.buffer.push(value);
    }
    _error(err) {
        this.destination.error(err);
    }
    _complete() {
        this.destination.complete();
    }
    flushBuffer() {
        const buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
        if (this.isUnsubscribed) {
            this.notifierSubscriber.unsubscribe();
        }
    }
}
class BufferClosingNotifierSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
    }
    _next(value) {
        this.parent.flushBuffer();
    }
    _error(err) {
        this.parent.error(err);
    }
    _complete() {
        this.parent.complete();
    }
}
//# sourceMappingURL=buffer.js.map
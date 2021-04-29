/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { Subject } from '../Subject';
export function window(closingNotifier) {
    return this.lift(new WindowOperator(closingNotifier));
}
class WindowOperator {
    constructor(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    call(subscriber) {
        return new WindowSubscriber(subscriber, this.closingNotifier);
    }
}
class WindowSubscriber extends Subscriber {
    constructor(destination, closingNotifier) {
        super(destination);
        this.destination = destination;
        this.closingNotifier = closingNotifier;
        this.add(closingNotifier._subscribe(new WindowClosingNotifierSubscriber(this)));
        this.openWindow();
    }
    _next(value) {
        this.window.next(value);
    }
    _error(err) {
        this.window.error(err);
        this.destination.error(err);
    }
    _complete() {
        this.window.complete();
        this.destination.complete();
    }
    openWindow() {
        const prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        const destination = this.destination;
        const newWindow = this.window = new Subject();
        destination.add(newWindow);
        destination.next(newWindow);
    }
}
class WindowClosingNotifierSubscriber extends Subscriber {
    constructor(parent) {
        super(null);
        this.parent = parent;
    }
    _next() {
        this.parent.openWindow();
    }
    _error(err) {
        this.parent._error(err);
    }
    _complete() {
        this.parent._complete();
    }
}
//# sourceMappingURL=window.js.map
/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { Subject } from '../Subject';
import { Subscription } from '../Subscription';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function windowWhen(closingSelector) {
    return this.lift(new WindowOperator(closingSelector));
}
class WindowOperator {
    constructor(closingSelector) {
        this.closingSelector = closingSelector;
    }
    call(subscriber) {
        return new WindowSubscriber(subscriber, this.closingSelector);
    }
}
class WindowSubscriber extends Subscriber {
    constructor(destination, closingSelector) {
        super(destination);
        this.destination = destination;
        this.closingSelector = closingSelector;
        this.openWindow();
    }
    _next(value) {
        this.window.next(value);
    }
    _error(err) {
        this.window.error(err);
        this.destination.error(err);
        this._unsubscribeClosingNotification();
    }
    _complete() {
        this.window.complete();
        this.destination.complete();
        this._unsubscribeClosingNotification();
    }
    unsubscribe() {
        super.unsubscribe();
        this._unsubscribeClosingNotification();
    }
    _unsubscribeClosingNotification() {
        let closingNotification = this.closingNotification;
        if (closingNotification) {
            closingNotification.unsubscribe();
        }
    }
    openWindow() {
        const prevClosingNotification = this.closingNotification;
        if (prevClosingNotification) {
            this.remove(prevClosingNotification);
            prevClosingNotification.unsubscribe();
        }
        const prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        const window = this.window = new Subject();
        this.destination.next(window);
        const closingNotifier = tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject) {
            const err = closingNotifier.e;
            this.destination.error(err);
            this.window.error(err);
        }
        else {
            const closingNotification = this.closingNotification = new Subscription();
            closingNotification.add(closingNotifier._subscribe(new WindowClosingNotifierSubscriber(this)));
            this.add(closingNotification);
            this.add(window);
        }
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
        this.parent.error(err);
    }
    _complete() {
        this.parent.openWindow();
    }
}
//# sourceMappingURL=windowWhen.js.map
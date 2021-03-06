/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { Subject } from '../Subject';
import { Subscription } from '../Subscription';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function windowToggle(openings, closingSelector) {
    return this.lift(new WindowToggleOperator(openings, closingSelector));
}
class WindowToggleOperator {
    constructor(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    call(subscriber) {
        return new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector);
    }
}
class WindowToggleSubscriber extends Subscriber {
    constructor(destination, openings, closingSelector) {
        super(destination);
        this.destination = destination;
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(this.openings._subscribe(new WindowToggleOpeningsSubscriber(this)));
    }
    _next(value) {
        const contexts = this.contexts;
        const len = contexts.length;
        for (let i = 0; i < len; i++) {
            contexts[i].window.next(value);
        }
    }
    _error(err) {
        const contexts = this.contexts;
        while (contexts.length > 0) {
            contexts.shift().window.error(err);
        }
        this.destination.error(err);
    }
    _complete() {
        const contexts = this.contexts;
        while (contexts.length > 0) {
            const context = contexts.shift();
            context.window.complete();
            context.subscription.unsubscribe();
        }
        this.destination.complete();
    }
    openWindow(value) {
        const closingSelector = this.closingSelector;
        let closingNotifier = tryCatch(closingSelector)(value);
        if (closingNotifier === errorObject) {
            this.error(closingNotifier.e);
        }
        else {
            const destination = this.destination;
            const window = new Subject();
            const subscription = new Subscription();
            const context = { window, subscription };
            this.contexts.push(context);
            const subscriber = new WindowClosingNotifierSubscriber(this, context);
            const closingSubscription = closingNotifier._subscribe(subscriber);
            subscription.add(closingSubscription);
            destination.add(subscription);
            destination.add(window);
            destination.next(window);
        }
    }
    closeWindow(context) {
        const { window, subscription } = context;
        const contexts = this.contexts;
        const destination = this.destination;
        contexts.splice(contexts.indexOf(context), 1);
        window.complete();
        destination.remove(subscription);
        destination.remove(window);
        subscription.unsubscribe();
    }
}
class WindowClosingNotifierSubscriber extends Subscriber {
    constructor(parent, windowContext) {
        super(null);
        this.parent = parent;
        this.windowContext = windowContext;
    }
    _next() {
        this.parent.closeWindow(this.windowContext);
    }
    _error(err) {
        this.parent.error(err);
    }
    _complete() {
        this.parent.closeWindow(this.windowContext);
    }
}
class WindowToggleOpeningsSubscriber extends Subscriber {
    constructor(parent) {
        super();
        this.parent = parent;
    }
    _next(value) {
        this.parent.openWindow(value);
    }
    _error(err) {
        this.parent.error(err);
    }
    _complete() {
        // noop
    }
}
//# sourceMappingURL=windowToggle.js.map
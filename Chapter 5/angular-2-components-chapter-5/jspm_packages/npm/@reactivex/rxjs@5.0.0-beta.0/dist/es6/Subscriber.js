/* */ 
"format cjs";
import { noop } from './util/noop';
import { throwError } from './util/throwError';
import { tryOrOnError } from './util/tryOrOnError';
import { Subscription } from './Subscription';
import { rxSubscriber } from './symbol/rxSubscriber';
export class Subscriber extends Subscription {
    constructor(destination) {
        super();
        this.destination = destination;
        this._isUnsubscribed = false;
        if (!this.destination) {
            return;
        }
        const subscription = destination._subscription;
        if (subscription) {
            this._subscription = subscription;
        }
        else if (destination instanceof Subscriber) {
            this._subscription = destination;
        }
    }
    [rxSubscriber]() {
        return this;
    }
    get isUnsubscribed() {
        const subscription = this._subscription;
        if (subscription) {
            // route to the shared Subscription if it exists
            return this._isUnsubscribed || subscription.isUnsubscribed;
        }
        else {
            return this._isUnsubscribed;
        }
    }
    set isUnsubscribed(value) {
        const subscription = this._subscription;
        if (subscription) {
            // route to the shared Subscription if it exists
            subscription.isUnsubscribed = Boolean(value);
        }
        else {
            this._isUnsubscribed = Boolean(value);
        }
    }
    static create(next, error, complete) {
        const subscriber = new Subscriber();
        subscriber._next = (typeof next === 'function') && tryOrOnError(next) || noop;
        subscriber._error = (typeof error === 'function') && error || throwError;
        subscriber._complete = (typeof complete === 'function') && complete || noop;
        return subscriber;
    }
    add(sub) {
        // route add to the shared Subscription if it exists
        const _subscription = this._subscription;
        if (_subscription) {
            _subscription.add(sub);
        }
        else {
            super.add(sub);
        }
    }
    remove(sub) {
        // route remove to the shared Subscription if it exists
        if (this._subscription) {
            this._subscription.remove(sub);
        }
        else {
            super.remove(sub);
        }
    }
    unsubscribe() {
        if (this._isUnsubscribed) {
            return;
        }
        else if (this._subscription) {
            this._isUnsubscribed = true;
        }
        else {
            super.unsubscribe();
        }
    }
    _next(value) {
        const destination = this.destination;
        if (destination.next) {
            destination.next(value);
        }
    }
    _error(err) {
        const destination = this.destination;
        if (destination.error) {
            destination.error(err);
        }
    }
    _complete() {
        const destination = this.destination;
        if (destination.complete) {
            destination.complete();
        }
    }
    next(value) {
        if (!this.isUnsubscribed) {
            this._next(value);
        }
    }
    error(err) {
        if (!this.isUnsubscribed) {
            this._error(err);
            this.unsubscribe();
        }
    }
    complete() {
        if (!this.isUnsubscribed) {
            this._complete();
            this.unsubscribe();
        }
    }
}
//# sourceMappingURL=Subscriber.js.map
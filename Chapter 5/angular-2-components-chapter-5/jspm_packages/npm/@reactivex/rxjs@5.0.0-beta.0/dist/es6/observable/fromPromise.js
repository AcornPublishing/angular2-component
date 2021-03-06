/* */ 
"format cjs";
import { Observable } from '../Observable';
import { Subscription } from '../Subscription';
import { queue } from '../scheduler/queue';
export class PromiseObservable extends Observable {
    constructor(promise, scheduler = queue) {
        super();
        this.promise = promise;
        this.scheduler = scheduler;
        this._isScalar = false;
    }
    static create(promise, scheduler = queue) {
        return new PromiseObservable(promise, scheduler);
    }
    _subscribe(subscriber) {
        const scheduler = this.scheduler;
        const promise = this.promise;
        if (scheduler === queue) {
            if (this._isScalar) {
                subscriber.next(this.value);
                subscriber.complete();
            }
            else {
                promise.then(value => {
                    this._isScalar = true;
                    this.value = value;
                    subscriber.next(value);
                    subscriber.complete();
                }, err => subscriber.error(err))
                    .then(null, err => {
                    // escape the promise trap, throw unhandled errors
                    setTimeout(() => { throw err; });
                });
            }
        }
        else {
            let subscription = new Subscription();
            if (this._isScalar) {
                const value = this.value;
                subscription.add(scheduler.schedule(dispatchNext, 0, { value, subscriber }));
            }
            else {
                promise.then(value => {
                    this._isScalar = true;
                    this.value = value;
                    subscription.add(scheduler.schedule(dispatchNext, 0, { value, subscriber }));
                }, err => subscription.add(scheduler.schedule(dispatchError, 0, { err, subscriber })))
                    .then(null, err => {
                    // escape the promise trap, throw unhandled errors
                    scheduler.schedule(() => { throw err; });
                });
            }
            return subscription;
        }
    }
}
function dispatchNext({ value, subscriber }) {
    subscriber.next(value);
    subscriber.complete();
}
function dispatchError({ err, subscriber }) {
    subscriber.error(err);
}
//# sourceMappingURL=fromPromise.js.map
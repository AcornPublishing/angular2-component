/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
/**
 * Catches errors on the observable to be handled by returning a new observable or throwing an error.
 * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
 *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
 *  is returned by the `selector` will be used to continue the observable chain.
 * @return {Observable} an observable that originates from either the source or the observable returned by the
 *  catch `selector` function.
 */
export function _catch(selector) {
    let catchOperator = new CatchOperator(selector);
    let caught = this.lift(catchOperator);
    catchOperator.caught = caught;
    return caught;
}
class CatchOperator {
    constructor(selector) {
        this.selector = selector;
    }
    call(subscriber) {
        return new CatchSubscriber(subscriber, this.selector, this.caught);
    }
}
class CatchSubscriber extends Subscriber {
    constructor(destination, selector, caught) {
        super(null);
        this.destination = destination;
        this.selector = selector;
        this.caught = caught;
        this.lastSubscription = this;
        this.destination.add(this);
    }
    _next(value) {
        this.destination.next(value);
    }
    _error(err) {
        const result = tryCatch(this.selector)(err, this.caught);
        if (result === errorObject) {
            this.destination.error(errorObject.e);
        }
        else {
            this.lastSubscription.unsubscribe();
            this.lastSubscription = result.subscribe(this.destination);
        }
    }
    _complete() {
        this.lastSubscription.unsubscribe();
        this.destination.complete();
    }
    _unsubscribe() {
        this.lastSubscription.unsubscribe();
    }
}
//# sourceMappingURL=catch.js.map
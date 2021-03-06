/* */ 
"format cjs";
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
export function switchMap(project, resultSelector) {
    return this.lift(new SwitchMapOperator(project, resultSelector));
}
class SwitchMapOperator {
    constructor(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    call(subscriber) {
        return new SwitchMapSubscriber(subscriber, this.project, this.resultSelector);
    }
}
class SwitchMapSubscriber extends OuterSubscriber {
    constructor(destination, project, resultSelector) {
        super(destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.hasCompleted = false;
        this.index = 0;
    }
    _next(value) {
        const index = this.index++;
        const destination = this.destination;
        let result = tryCatch(this.project)(value, index);
        if (result === errorObject) {
            destination.error(result.e);
        }
        else {
            const innerSubscription = this.innerSubscription;
            if (innerSubscription) {
                innerSubscription.unsubscribe();
            }
            this.add(this.innerSubscription = subscribeToResult(this, result, value, index));
        }
    }
    _complete() {
        const innerSubscription = this.innerSubscription;
        this.hasCompleted = true;
        if (!innerSubscription || innerSubscription.isUnsubscribed) {
            this.destination.complete();
        }
    }
    notifyComplete(innerSub) {
        this.remove(innerSub);
        const prevSubscription = this.innerSubscription;
        if (prevSubscription) {
            prevSubscription.unsubscribe();
        }
        this.innerSubscription = null;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    }
    notifyError(err) {
        this.destination.error(err);
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex) {
        const { resultSelector, destination } = this;
        if (resultSelector) {
            const result = tryCatch(resultSelector)(outerValue, innerValue, outerIndex, innerIndex);
            if (result === errorObject) {
                destination.error(errorObject.e);
            }
            else {
                destination.next(result);
            }
        }
        else {
            destination.next(innerValue);
        }
    }
}
//# sourceMappingURL=switchMap.js.map
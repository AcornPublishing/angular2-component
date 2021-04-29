/* */ 
"format cjs";
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
export function exhaustMap(project, resultSelector) {
    return this.lift(new SwitchFirstMapOperator(project, resultSelector));
}
class SwitchFirstMapOperator {
    constructor(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    call(subscriber) {
        return new SwitchFirstMapSubscriber(subscriber, this.project, this.resultSelector);
    }
}
class SwitchFirstMapSubscriber extends OuterSubscriber {
    constructor(destination, project, resultSelector) {
        super(destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.hasSubscription = false;
        this.hasCompleted = false;
        this.index = 0;
    }
    _next(value) {
        if (!this.hasSubscription) {
            const index = this.index++;
            const destination = this.destination;
            let result = tryCatch(this.project)(value, index);
            if (result === errorObject) {
                destination.error(result.e);
            }
            else {
                this.hasSubscription = true;
                this.add(subscribeToResult(this, result, value, index));
            }
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
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
    notifyError(err) {
        this.destination.error(err);
    }
    notifyComplete() {
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=exhaustMap.js.map
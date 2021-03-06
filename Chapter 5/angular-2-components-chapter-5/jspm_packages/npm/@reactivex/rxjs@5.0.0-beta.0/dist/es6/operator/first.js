/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { EmptyError } from '../util/EmptyError';
export function first(predicate, resultSelector, defaultValue) {
    return this.lift(new FirstOperator(predicate, resultSelector, defaultValue, this));
}
class FirstOperator {
    constructor(predicate, resultSelector, defaultValue, source) {
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
    }
    call(observer) {
        return new FirstSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source);
    }
}
class FirstSubscriber extends Subscriber {
    constructor(destination, predicate, resultSelector, defaultValue, source) {
        super(destination);
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
        this.index = 0;
        this.hasCompleted = false;
    }
    _next(value) {
        const { destination, predicate, resultSelector } = this;
        const index = this.index++;
        let passed = true;
        if (predicate) {
            passed = tryCatch(predicate)(value, index, this.source);
            if (passed === errorObject) {
                destination.error(errorObject.e);
                return;
            }
        }
        if (passed) {
            if (resultSelector) {
                let result = tryCatch(resultSelector)(value, index);
                if (result === errorObject) {
                    destination.error(errorObject.e);
                    return;
                }
                destination.next(result);
            }
            else {
                destination.next(value);
            }
            destination.complete();
            this.hasCompleted = true;
        }
    }
    _complete() {
        const destination = this.destination;
        if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
            destination.next(this.defaultValue);
            destination.complete();
        }
        else if (!this.hasCompleted) {
            destination.error(new EmptyError);
        }
    }
}
//# sourceMappingURL=first.js.map
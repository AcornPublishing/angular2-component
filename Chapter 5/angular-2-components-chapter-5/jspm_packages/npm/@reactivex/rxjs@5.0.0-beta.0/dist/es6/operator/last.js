/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { EmptyError } from '../util/EmptyError';
export function last(predicate, resultSelector, defaultValue) {
    return this.lift(new LastOperator(predicate, resultSelector, defaultValue, this));
}
class LastOperator {
    constructor(predicate, resultSelector, defaultValue, source) {
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
    }
    call(observer) {
        return new LastSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source);
    }
}
class LastSubscriber extends Subscriber {
    constructor(destination, predicate, resultSelector, defaultValue, source) {
        super(destination);
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
        this.hasValue = false;
        this.index = 0;
        if (typeof defaultValue !== 'undefined') {
            this.lastValue = defaultValue;
            this.hasValue = true;
        }
    }
    _next(value) {
        const { predicate, resultSelector, destination } = this;
        const index = this.index++;
        if (predicate) {
            let found = tryCatch(predicate)(value, index, this.source);
            if (found === errorObject) {
                destination.error(errorObject.e);
                return;
            }
            if (found) {
                if (resultSelector) {
                    let result = tryCatch(resultSelector)(value, index);
                    if (result === errorObject) {
                        destination.error(errorObject.e);
                        return;
                    }
                    this.lastValue = result;
                }
                else {
                    this.lastValue = value;
                }
                this.hasValue = true;
            }
        }
        else {
            this.lastValue = value;
            this.hasValue = true;
        }
    }
    _complete() {
        const destination = this.destination;
        if (this.hasValue) {
            destination.next(this.lastValue);
            destination.complete();
        }
        else {
            destination.error(new EmptyError);
        }
    }
}
//# sourceMappingURL=last.js.map
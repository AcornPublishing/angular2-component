/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { EmptyError } from '../util/EmptyError';
export function single(predicate) {
    return this.lift(new SingleOperator(predicate, this));
}
class SingleOperator {
    constructor(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    call(subscriber) {
        return new SingleSubscriber(subscriber, this.predicate, this.source);
    }
}
class SingleSubscriber extends Subscriber {
    constructor(destination, predicate, source) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.seenValue = false;
        this.index = 0;
    }
    applySingleValue(value) {
        if (this.seenValue) {
            this.destination.error('Sequence contains more than one element');
        }
        else {
            this.seenValue = true;
            this.singleValue = value;
        }
    }
    _next(value) {
        const predicate = this.predicate;
        const currentIndex = this.index++;
        if (predicate) {
            let result = tryCatch(predicate)(value, currentIndex, this.source);
            if (result === errorObject) {
                this.destination.error(result.e);
            }
            else if (result) {
                this.applySingleValue(value);
            }
        }
        else {
            this.applySingleValue(value);
        }
    }
    _complete() {
        const destination = this.destination;
        if (this.index > 0) {
            destination.next(this.seenValue ? this.singleValue : undefined);
            destination.complete();
        }
        else {
            destination.error(new EmptyError);
        }
    }
}
//# sourceMappingURL=single.js.map
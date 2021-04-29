/* */ 
"format cjs";
import { ScalarObservable } from '../observable/ScalarObservable';
import { ArrayObservable } from '../observable/fromArray';
import { ErrorObservable } from '../observable/throw';
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function every(predicate, thisArg) {
    const source = this;
    let result;
    if (source._isScalar) {
        result = tryCatch(predicate).call(thisArg || this, source.value, 0, source);
        if (result === errorObject) {
            return new ErrorObservable(errorObject.e, source.scheduler);
        }
        else {
            return new ScalarObservable(result, source.scheduler);
        }
    }
    if (source instanceof ArrayObservable) {
        const array = source.array;
        let result = tryCatch((array, predicate, thisArg) => array.every(predicate, thisArg))(array, predicate, thisArg);
        if (result === errorObject) {
            return new ErrorObservable(errorObject.e, source.scheduler);
        }
        else {
            return new ScalarObservable(result, source.scheduler);
        }
    }
    return source.lift(new EveryOperator(predicate, thisArg, source));
}
class EveryOperator {
    constructor(predicate, thisArg, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
    }
    call(observer) {
        return new EverySubscriber(observer, this.predicate, this.thisArg, this.source);
    }
}
class EverySubscriber extends Subscriber {
    constructor(destination, predicate, thisArg, source) {
        super(destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
        this.index = 0;
    }
    notifyComplete(everyValueMatch) {
        this.destination.next(everyValueMatch);
        this.destination.complete();
    }
    _next(value) {
        const result = tryCatch(this.predicate).call(this.thisArg || this, value, this.index++, this.source);
        if (result === errorObject) {
            this.destination.error(result.e);
        }
        else if (!result) {
            this.notifyComplete(false);
        }
    }
    _complete() {
        this.notifyComplete(true);
    }
}
//# sourceMappingURL=every.js.map
/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function scan(accumulator, seed) {
    return this.lift(new ScanOperator(accumulator, seed));
}
class ScanOperator {
    constructor(accumulator, seed) {
        this.accumulator = accumulator;
        this.seed = seed;
    }
    call(subscriber) {
        return new ScanSubscriber(subscriber, this.accumulator, this.seed);
    }
}
class ScanSubscriber extends Subscriber {
    constructor(destination, accumulator, seed) {
        super(destination);
        this.accumulator = accumulator;
        this.accumulatorSet = false;
        this.seed = seed;
        this.accumulator = accumulator;
        this.accumulatorSet = typeof seed !== 'undefined';
    }
    get seed() {
        return this._seed;
    }
    set seed(value) {
        this.accumulatorSet = true;
        this._seed = value;
    }
    _next(value) {
        if (!this.accumulatorSet) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            const result = tryCatch(this.accumulator).call(this, this.seed, value);
            if (result === errorObject) {
                this.destination.error(errorObject.e);
            }
            else {
                this.seed = result;
                this.destination.next(this.seed);
            }
        }
    }
}
//# sourceMappingURL=scan.js.map
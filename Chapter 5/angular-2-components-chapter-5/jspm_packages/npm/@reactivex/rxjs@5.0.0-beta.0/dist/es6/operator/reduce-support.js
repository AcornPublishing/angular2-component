/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export class ReduceOperator {
    constructor(project, seed) {
        this.project = project;
        this.seed = seed;
    }
    call(subscriber) {
        return new ReduceSubscriber(subscriber, this.project, this.seed);
    }
}
export class ReduceSubscriber extends Subscriber {
    constructor(destination, project, seed) {
        super(destination);
        this.hasValue = false;
        this.acc = seed;
        this.project = project;
        this.hasSeed = typeof seed !== 'undefined';
    }
    _next(x) {
        if (this.hasValue || (this.hasValue = this.hasSeed)) {
            const result = tryCatch(this.project).call(this, this.acc, x);
            if (result === errorObject) {
                this.destination.error(errorObject.e);
            }
            else {
                this.acc = result;
            }
        }
        else {
            this.acc = x;
            this.hasValue = true;
        }
    }
    _complete() {
        if (this.hasValue || this.hasSeed) {
            this.destination.next(this.acc);
        }
        this.destination.complete();
    }
}
//# sourceMappingURL=reduce-support.js.map
/* */ 
"format cjs";
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
export class CombineLatestOperator {
    constructor(project) {
        this.project = project;
    }
    call(subscriber) {
        return new CombineLatestSubscriber(subscriber, this.project);
    }
}
export class CombineLatestSubscriber extends OuterSubscriber {
    constructor(destination, project) {
        super(destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
        this.toRespond = [];
    }
    _next(observable) {
        const toRespond = this.toRespond;
        toRespond.push(toRespond.length);
        this.observables.push(observable);
    }
    _complete() {
        const observables = this.observables;
        const len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            for (let i = 0; i < len; i++) {
                const observable = observables[i];
                this.add(subscribeToResult(this, observable, observable, i));
            }
        }
    }
    notifyComplete(unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    }
    notifyNext(observable, value, outerIndex, innerIndex) {
        const values = this.values;
        values[outerIndex] = value;
        const toRespond = this.toRespond;
        if (toRespond.length > 0) {
            const found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
        if (toRespond.length === 0) {
            const project = this.project;
            const destination = this.destination;
            if (project) {
                const result = tryCatch(project).apply(this, values);
                if (result === errorObject) {
                    destination.error(errorObject.e);
                }
                else {
                    destination.next(result);
                }
            }
            else {
                destination.next(values);
            }
        }
    }
}
//# sourceMappingURL=combineLatest-support.js.map
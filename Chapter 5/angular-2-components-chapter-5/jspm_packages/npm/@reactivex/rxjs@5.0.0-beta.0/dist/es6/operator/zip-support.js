/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
import { SymbolShim } from '../util/SymbolShim';
const isArray = Array.isArray;
export class ZipOperator {
    constructor(project) {
        this.project = project;
    }
    call(subscriber) {
        return new ZipSubscriber(subscriber, this.project);
    }
}
export class ZipSubscriber extends Subscriber {
    constructor(destination, project, values = Object.create(null)) {
        super(destination);
        this.index = 0;
        this.iterators = [];
        this.active = 0;
        this.project = (typeof project === 'function') ? project : null;
        this.values = values;
    }
    _next(value) {
        const iterators = this.iterators;
        const index = this.index++;
        if (isArray(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[SymbolShim.iterator] === 'function') {
            iterators.push(new StaticIterator(value[SymbolShim.iterator]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value, index));
        }
    }
    _complete() {
        const iterators = this.iterators;
        const len = iterators.length;
        this.active = len;
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                iterator.subscribe(iterator, i);
            }
            else {
                this.active--; // not an observable
            }
        }
    }
    notifyInactive() {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    }
    checkIterators() {
        const iterators = this.iterators;
        const len = iterators.length;
        const destination = this.destination;
        // abort if not all of them have values
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        let shouldComplete = false;
        const args = [];
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            let result = iterator.next();
            // check to see if it's completed now that you've gotten
            // the next value.
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        const project = this.project;
        if (project) {
            let result = tryCatch(project).apply(this, args);
            if (result === errorObject) {
                destination.error(errorObject.e);
            }
            else {
                destination.next(result);
            }
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    }
}
class StaticIterator {
    constructor(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    hasValue() {
        return true;
    }
    next() {
        const result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    }
    hasCompleted() {
        const nextResult = this.nextResult;
        return nextResult && nextResult.done;
    }
}
class StaticArrayIterator {
    constructor(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    [SymbolShim.iterator]() {
        return this;
    }
    next(value) {
        const i = this.index++;
        const array = this.array;
        return i < this.length ? { value: array[i], done: false } : { done: true };
    }
    hasValue() {
        return this.array.length > this.index;
    }
    hasCompleted() {
        return this.array.length === this.index;
    }
}
class ZipBufferIterator extends OuterSubscriber {
    constructor(destination, parent, observable, index) {
        super(destination);
        this.parent = parent;
        this.observable = observable;
        this.index = index;
        this.stillUnsubscribed = true;
        this.buffer = [];
        this.isComplete = false;
    }
    [SymbolShim.iterator]() {
        return this;
    }
    // NOTE: there is actually a name collision here with Subscriber.next and Iterator.next
    //    this is legit because `next()` will never be called by a subscription in this case.
    next() {
        const buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    }
    hasValue() {
        return this.buffer.length > 0;
    }
    hasCompleted() {
        return this.buffer.length === 0 && this.isComplete;
    }
    notifyComplete() {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    }
    subscribe(value, index) {
        this.add(subscribeToResult(this, this.observable, this, index));
    }
}
//# sourceMappingURL=zip-support.js.map
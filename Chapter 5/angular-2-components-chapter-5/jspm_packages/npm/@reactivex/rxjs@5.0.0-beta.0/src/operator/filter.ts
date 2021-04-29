import {Operator} from '../Operator';
import {Subscriber} from '../Subscriber';
import {tryCatch} from '../util/tryCatch';
import {errorObject} from '../util/errorObject';

/**
 * Similar to the well-known `Array.prototype.filter` method, this operator filters values down to a set
 * allowed by a `select` function
 *
 * @param {Function} select a function that is used to select the resulting values
 *  if it returns `true`, the value is emitted, if `false` the value is not passed to the resulting observable
 * @param {any} [thisArg] an optional argument to determine the value of `this` in the `select` function
 * @returns {Observable} an observable of values allowed by the select function
 */
export function filter<T>(select: (x: T, ix?: number) => boolean, thisArg?: any) {
  return this.lift(new FilterOperator(select, thisArg));
}

class FilterOperator<T, R> implements Operator<T, R> {
  constructor(private select: (x: T, ix?: number) => boolean, private thisArg?: any) {
  }

  call(subscriber: Subscriber<T>): Subscriber<T> {
    return new FilterSubscriber(subscriber, this.select, this.thisArg);
  }
}

class FilterSubscriber<T> extends Subscriber<T> {

  count: number = 0;
  select: (x: T, ix?: number) => boolean;

  constructor(destination: Subscriber<T>, select: (x: T, ix?: number) => boolean, private thisArg: any) {
    super(destination);
    this.select = select;
  }

  _next(x) {
    const result = tryCatch(this.select).call(this.thisArg || this, x, this.count++);
    if (result === errorObject) {
      this.destination.error(errorObject.e);
    } else if (Boolean(result)) {
      this.destination.next(x);
    }
  }
}

/* */ 
"format cjs";
import { MergeAllOperator } from './mergeAll-support';
/**
 * Joins every Observable emitted by the source (an Observable of Observables), in a serial
 * fashion. Subscribing to each one only when the previous one has completed, and merging
 * all of their values into the returned observable.
 *
 * __Warning:__ If the source Observable emits Observables quickly and endlessly, and the
 * Observables it emits generally complete slower than the source emits, you can run into
 * memory issues as the incoming observables collect in an unbounded buffer.
 *
 * @returns {Observable} an observable of values merged from the incoming observables.
 */
export function concatAll() {
    return this.lift(new MergeAllOperator(1));
}
//# sourceMappingURL=concatAll.js.map
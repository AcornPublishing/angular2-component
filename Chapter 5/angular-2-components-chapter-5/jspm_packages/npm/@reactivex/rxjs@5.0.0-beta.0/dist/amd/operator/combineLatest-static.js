/* */ 
"format cjs";
define(["require", "exports", '../observable/fromArray', './combineLatest-support', '../util/isScheduler', '../util/isArray'], function (require, exports, fromArray_1, combineLatest_support_1, isScheduler_1, isArray_1) {
    /**
     * Combines the values from observables passed as arguments. This is done by subscribing
     * to each observable, in order, and collecting an array of each of the most recent values any time any of the observables
     * emits, then either taking that array and passing it as arguments to an option `project` function and emitting the return
     * value of that, or just emitting the array of recent values directly if there is no `project` function.
     * @param {...Observable} observables the observables to combine
     * @param {function} [project] an optional function to project the values from the combined recent values into a new value for emission.
     * @returns {Observable} an observable of other projected values from the most recent values from each observable, or an array of each of
     * the most recent values from each observable.
     */
    function combineLatest() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        var project = null;
        var scheduler = null;
        if (isScheduler_1.isScheduler(observables[observables.length - 1])) {
            scheduler = observables.pop();
        }
        if (typeof observables[observables.length - 1] === 'function') {
            project = observables.pop();
        }
        // if the first and only other argument besides the resultSelector is an array
        // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
        if (observables.length === 1 && isArray_1.isArray(observables[0])) {
            observables = observables[0];
        }
        return new fromArray_1.ArrayObservable(observables, scheduler).lift(new combineLatest_support_1.CombineLatestOperator(project));
    }
    exports.combineLatest = combineLatest;
});
//# sourceMappingURL=combineLatest-static.js.map
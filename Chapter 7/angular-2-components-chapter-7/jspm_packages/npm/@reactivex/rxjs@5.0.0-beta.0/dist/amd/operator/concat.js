/* */ 
"format cjs";
define(["require", "exports", '../util/isScheduler', '../observable/fromArray', './mergeAll-support'], function (require, exports, isScheduler_1, fromArray_1, mergeAll_support_1) {
    /**
     * Joins this observable with multiple other observables by subscribing to them one at a time, starting with the source,
     * and merging their results into the returned observable. Will wait for each observable to complete before moving
     * on to the next.
     * @params {...Observable} the observables to concatenate
     * @params {Scheduler} [scheduler] an optional scheduler to schedule each observable subscription on.
     * @returns {Observable} All values of each passed observable merged into a single observable, in order, in serial fashion.
     */
    function concat() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        var args = observables;
        args.unshift(this);
        var scheduler = null;
        if (isScheduler_1.isScheduler(args[args.length - 1])) {
            scheduler = args.pop();
        }
        return new fromArray_1.ArrayObservable(args, scheduler).lift(new mergeAll_support_1.MergeAllOperator(1));
    }
    exports.concat = concat;
});
//# sourceMappingURL=concat.js.map
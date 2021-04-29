/* */ 
"format cjs";
define(["require", "exports", '../observable/fromArray', './mergeAll-support', '../scheduler/queue', '../util/isScheduler'], function (require, exports, fromArray_1, mergeAll_support_1, queue_1, isScheduler_1) {
    function merge() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        var concurrent = Number.POSITIVE_INFINITY;
        var scheduler = queue_1.queue;
        var last = observables[observables.length - 1];
        if (isScheduler_1.isScheduler(last)) {
            scheduler = observables.pop();
            if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
                concurrent = observables.pop();
            }
        }
        else if (typeof last === 'number') {
            concurrent = observables.pop();
        }
        if (observables.length === 1) {
            return observables[0];
        }
        return new fromArray_1.ArrayObservable(observables, scheduler).lift(new mergeAll_support_1.MergeAllOperator(concurrent));
    }
    exports.merge = merge;
});
//# sourceMappingURL=merge-static.js.map
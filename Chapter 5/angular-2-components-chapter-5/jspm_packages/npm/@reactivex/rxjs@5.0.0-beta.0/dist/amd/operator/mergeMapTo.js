/* */ 
"format cjs";
define(["require", "exports", './mergeMapTo-support'], function (require, exports, mergeMapTo_support_1) {
    function mergeMapTo(observable, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        return this.lift(new mergeMapTo_support_1.MergeMapToOperator(observable, resultSelector, concurrent));
    }
    exports.mergeMapTo = mergeMapTo;
});
//# sourceMappingURL=mergeMapTo.js.map
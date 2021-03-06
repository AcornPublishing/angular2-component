/* */ 
"format cjs";
define(["require", "exports", './mergeMap-support'], function (require, exports, mergeMap_support_1) {
    function mergeMap(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        return this.lift(new mergeMap_support_1.MergeMapOperator(project, resultSelector, concurrent));
    }
    exports.mergeMap = mergeMap;
});
//# sourceMappingURL=mergeMap.js.map
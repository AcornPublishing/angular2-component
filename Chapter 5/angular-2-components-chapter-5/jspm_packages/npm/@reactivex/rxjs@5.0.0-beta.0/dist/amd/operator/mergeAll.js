/* */ 
"format cjs";
define(["require", "exports", './mergeAll-support'], function (require, exports, mergeAll_support_1) {
    function mergeAll(concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        return this.lift(new mergeAll_support_1.MergeAllOperator(concurrent));
    }
    exports.mergeAll = mergeAll;
});
//# sourceMappingURL=mergeAll.js.map
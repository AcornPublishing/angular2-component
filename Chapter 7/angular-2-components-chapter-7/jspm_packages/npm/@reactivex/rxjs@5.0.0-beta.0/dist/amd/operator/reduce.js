/* */ 
"format cjs";
define(["require", "exports", './reduce-support'], function (require, exports, reduce_support_1) {
    function reduce(project, seed) {
        return this.lift(new reduce_support_1.ReduceOperator(project, seed));
    }
    exports.reduce = reduce;
});
//# sourceMappingURL=reduce.js.map
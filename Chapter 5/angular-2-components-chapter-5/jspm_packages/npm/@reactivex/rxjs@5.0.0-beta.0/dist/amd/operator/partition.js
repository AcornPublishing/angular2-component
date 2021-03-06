/* */ 
"format cjs";
define(["require", "exports", '../util/not', './filter'], function (require, exports, not_1, filter_1) {
    function partition(predicate, thisArg) {
        return [
            filter_1.filter.call(this, predicate),
            filter_1.filter.call(this, not_1.not(predicate, thisArg))
        ];
    }
    exports.partition = partition;
});
//# sourceMappingURL=partition.js.map
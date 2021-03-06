/* */ 
"format cjs";
define(["require", "exports", './mergeMapTo-support'], function (require, exports, mergeMapTo_support_1) {
    /**
     * Maps values from the source to a specific observable, and merges them together in a serialized fashion.
     *
     * @param {Observable} observable the observable to map each source value to
     * @param {function} [projectResult] an optional result selector that is applied to values before they're
     * merged into the returned observable. The arguments passed to this function are:
     * - `outerValue`: the value that came from the source
     * - `innerValue`: the value that came from the projected Observable
     * - `outerIndex`: the "index" of the value that came from the source
     * - `innerIndex`: the "index" of the value from the projected Observable
     * @returns {Observable} an observable of values merged together by joining the passed observable
     * with itself, one after the other, for each value emitted from the source.
     */
    function concatMapTo(observable, projectResult) {
        return this.lift(new mergeMapTo_support_1.MergeMapToOperator(observable, projectResult, 1));
    }
    exports.concatMapTo = concatMapTo;
});
//# sourceMappingURL=concatMapTo.js.map
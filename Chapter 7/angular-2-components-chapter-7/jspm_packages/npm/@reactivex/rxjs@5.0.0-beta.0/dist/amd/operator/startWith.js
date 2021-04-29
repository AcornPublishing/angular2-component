/* */ 
"format cjs";
define(["require", "exports", '../observable/fromArray', '../observable/ScalarObservable', '../observable/empty', './concat-static', '../util/isScheduler'], function (require, exports, fromArray_1, ScalarObservable_1, empty_1, concat_static_1, isScheduler_1) {
    function startWith() {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = void 0;
        }
        var len = array.length;
        if (len === 1) {
            return concat_static_1.concat(new ScalarObservable_1.ScalarObservable(array[0], scheduler), this);
        }
        else if (len > 1) {
            return concat_static_1.concat(new fromArray_1.ArrayObservable(array, scheduler), this);
        }
        else {
            return concat_static_1.concat(new empty_1.EmptyObservable(scheduler), this);
        }
    }
    exports.startWith = startWith;
});
//# sourceMappingURL=startWith.js.map
/* */ 
"format cjs";
define(["require", "exports", '../observable/fromArray', './zip-support'], function (require, exports, fromArray_1, zip_support_1) {
    function zip() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        var project = observables[observables.length - 1];
        if (typeof project === 'function') {
            observables.pop();
        }
        return new fromArray_1.ArrayObservable(observables).lift(new zip_support_1.ZipOperator(project));
    }
    exports.zip = zip;
});
//# sourceMappingURL=zip-static.js.map
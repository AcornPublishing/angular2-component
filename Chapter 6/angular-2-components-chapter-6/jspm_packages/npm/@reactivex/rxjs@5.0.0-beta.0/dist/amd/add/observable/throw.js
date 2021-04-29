/* */ 
"format cjs";
define(["require", "exports", '../../Observable', '../../observable/throw'], function (require, exports, Observable_1, throw_1) {
    Observable_1.Observable.throw = throw_1.ErrorObservable.create;
});
//# sourceMappingURL=throw.js.map
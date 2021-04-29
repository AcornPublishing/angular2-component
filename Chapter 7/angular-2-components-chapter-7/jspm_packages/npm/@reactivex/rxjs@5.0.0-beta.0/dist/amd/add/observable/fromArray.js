/* */ 
"format cjs";
define(["require", "exports", '../../Observable', '../../observable/fromArray'], function (require, exports, Observable_1, fromArray_1) {
    Observable_1.Observable.fromArray = fromArray_1.ArrayObservable.create;
    Observable_1.Observable.of = fromArray_1.ArrayObservable.of;
});
//# sourceMappingURL=fromArray.js.map
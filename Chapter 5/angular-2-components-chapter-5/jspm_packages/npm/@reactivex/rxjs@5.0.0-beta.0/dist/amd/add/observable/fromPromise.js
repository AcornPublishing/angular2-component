/* */ 
"format cjs";
define(["require", "exports", '../../Observable', '../../observable/fromPromise'], function (require, exports, Observable_1, fromPromise_1) {
    Observable_1.Observable.fromPromise = fromPromise_1.PromiseObservable.create;
});
//# sourceMappingURL=fromPromise.js.map
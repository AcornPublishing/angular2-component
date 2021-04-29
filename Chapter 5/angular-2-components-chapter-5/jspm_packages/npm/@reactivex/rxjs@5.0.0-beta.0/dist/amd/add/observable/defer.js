/* */ 
"format cjs";
define(["require", "exports", '../../Observable', '../../observable/defer'], function (require, exports, Observable_1, defer_1) {
    Observable_1.Observable.defer = defer_1.DeferObservable.create;
});
//# sourceMappingURL=defer.js.map
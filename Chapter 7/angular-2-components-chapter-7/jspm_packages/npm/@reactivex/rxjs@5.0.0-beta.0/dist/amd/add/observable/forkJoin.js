/* */ 
"format cjs";
define(["require", "exports", '../../Observable', '../../observable/forkJoin'], function (require, exports, Observable_1, forkJoin_1) {
    Observable_1.Observable.forkJoin = forkJoin_1.ForkJoinObservable.create;
});
//# sourceMappingURL=forkJoin.js.map
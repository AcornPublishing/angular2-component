/* */ 
"format cjs";
define(["require", "exports"], function (require, exports) {
    function not(pred, thisArg) {
        function notPred() {
            return !(notPred.pred.apply(notPred.thisArg, arguments));
        }
        notPred.pred = pred;
        notPred.thisArg = thisArg;
        return notPred;
    }
    exports.not = not;
});
//# sourceMappingURL=not.js.map
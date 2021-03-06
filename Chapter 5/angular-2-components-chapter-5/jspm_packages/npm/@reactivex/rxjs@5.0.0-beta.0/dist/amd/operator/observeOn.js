/* */ 
"format cjs";
define(["require", "exports", './observeOn-support'], function (require, exports, observeOn_support_1) {
    function observeOn(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        return this.lift(new observeOn_support_1.ObserveOnOperator(scheduler, delay));
    }
    exports.observeOn = observeOn;
});
//# sourceMappingURL=observeOn.js.map
/* */ 
"format cjs";
define(["require", "exports", '../observable/SubscribeOnObservable'], function (require, exports, SubscribeOnObservable_1) {
    function subscribeOn(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        return new SubscribeOnObservable_1.SubscribeOnObservable(this, delay, scheduler);
    }
    exports.subscribeOn = subscribeOn;
});
//# sourceMappingURL=subscribeOn.js.map
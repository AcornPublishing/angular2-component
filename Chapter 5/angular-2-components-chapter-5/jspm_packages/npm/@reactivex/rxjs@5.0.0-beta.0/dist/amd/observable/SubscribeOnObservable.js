/* */ 
"format cjs";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Observable', '../scheduler/asap', '../util/isNumeric'], function (require, exports, Observable_1, asap_1, isNumeric_1) {
    var SubscribeOnObservable = (function (_super) {
        __extends(SubscribeOnObservable, _super);
        function SubscribeOnObservable(source, delayTime, scheduler) {
            if (delayTime === void 0) { delayTime = 0; }
            if (scheduler === void 0) { scheduler = asap_1.asap; }
            _super.call(this);
            this.source = source;
            this.delayTime = delayTime;
            this.scheduler = scheduler;
            if (!isNumeric_1.isNumeric(delayTime) || delayTime < 0) {
                this.delayTime = 0;
            }
            if (!scheduler || typeof scheduler.schedule !== 'function') {
                this.scheduler = asap_1.asap;
            }
        }
        SubscribeOnObservable.create = function (source, delay, scheduler) {
            if (delay === void 0) { delay = 0; }
            if (scheduler === void 0) { scheduler = asap_1.asap; }
            return new SubscribeOnObservable(source, delay, scheduler);
        };
        SubscribeOnObservable.dispatch = function (_a) {
            var source = _a.source, subscriber = _a.subscriber;
            return source.subscribe(subscriber);
        };
        SubscribeOnObservable.prototype._subscribe = function (subscriber) {
            var delay = this.delayTime;
            var source = this.source;
            var scheduler = this.scheduler;
            subscriber.add(scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
                source: source, subscriber: subscriber
            }));
        };
        return SubscribeOnObservable;
    })(Observable_1.Observable);
    exports.SubscribeOnObservable = SubscribeOnObservable;
});
//# sourceMappingURL=SubscribeOnObservable.js.map
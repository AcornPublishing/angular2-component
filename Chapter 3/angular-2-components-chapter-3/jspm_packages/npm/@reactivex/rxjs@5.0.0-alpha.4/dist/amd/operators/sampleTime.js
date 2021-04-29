/* */ 
"format cjs";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../Subscriber', '../schedulers/nextTick'], function (require, exports, Subscriber_1, nextTick_1) {
    function sampleTime(delay, scheduler) {
        if (scheduler === void 0) { scheduler = nextTick_1.default; }
        return this.lift(new SampleTimeOperator(delay, scheduler));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = sampleTime;
    var SampleTimeOperator = (function () {
        function SampleTimeOperator(delay, scheduler) {
            this.delay = delay;
            this.scheduler = scheduler;
        }
        SampleTimeOperator.prototype.call = function (subscriber) {
            return new SampleTimeSubscriber(subscriber, this.delay, this.scheduler);
        };
        return SampleTimeOperator;
    })();
    var SampleTimeSubscriber = (function (_super) {
        __extends(SampleTimeSubscriber, _super);
        function SampleTimeSubscriber(destination, delay, scheduler) {
            _super.call(this, destination);
            this.delay = delay;
            this.scheduler = scheduler;
            this.hasValue = false;
            this.add(scheduler.schedule(dispatchNotification, delay, { subscriber: this, delay: delay }));
        }
        SampleTimeSubscriber.prototype._next = function (value) {
            this.lastValue = value;
            this.hasValue = true;
        };
        SampleTimeSubscriber.prototype.notifyNext = function () {
            if (this.hasValue) {
                this.destination.next(this.lastValue);
            }
        };
        return SampleTimeSubscriber;
    })(Subscriber_1.default);
    function dispatchNotification(state) {
        var subscriber = state.subscriber, delay = state.delay;
        subscriber.notifyNext();
        this.schedule(state, delay);
    }
});
//# sourceMappingURL=sampleTime.js.map
/* */ 
"format cjs";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './QueueScheduler', './AsapAction', './QueueAction'], function (require, exports, QueueScheduler_1, AsapAction_1, QueueAction_1) {
    var AsapScheduler = (function (_super) {
        __extends(AsapScheduler, _super);
        function AsapScheduler() {
            _super.apply(this, arguments);
        }
        AsapScheduler.prototype.scheduleNow = function (work, state) {
            return (this.scheduled ?
                new QueueAction_1.QueueAction(this, work) :
                new AsapAction_1.AsapAction(this, work)).schedule(state);
        };
        return AsapScheduler;
    })(QueueScheduler_1.QueueScheduler);
    exports.AsapScheduler = AsapScheduler;
});
//# sourceMappingURL=AsapScheduler.js.map
/* */ 
"format cjs";
define(["require", "exports", '../subject/BehaviorSubject', './multicast'], function (require, exports, BehaviorSubject_1, multicast_1) {
    function publishBehavior(value) {
        return multicast_1.multicast.call(this, new BehaviorSubject_1.BehaviorSubject(value));
    }
    exports.publishBehavior = publishBehavior;
});
//# sourceMappingURL=publishBehavior.js.map
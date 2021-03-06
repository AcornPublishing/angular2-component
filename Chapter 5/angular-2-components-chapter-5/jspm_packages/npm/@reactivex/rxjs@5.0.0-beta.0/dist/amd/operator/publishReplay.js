/* */ 
"format cjs";
define(["require", "exports", '../subject/ReplaySubject', './multicast'], function (require, exports, ReplaySubject_1, multicast_1) {
    function publishReplay(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
        return multicast_1.multicast.call(this, new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler));
    }
    exports.publishReplay = publishReplay;
});
//# sourceMappingURL=publishReplay.js.map
/* */ 
"format cjs";
define(["require", "exports", '../subject/AsyncSubject', './multicast'], function (require, exports, AsyncSubject_1, multicast_1) {
    function publishLast() {
        return multicast_1.multicast.call(this, new AsyncSubject_1.AsyncSubject());
    }
    exports.publishLast = publishLast;
});
//# sourceMappingURL=publishLast.js.map
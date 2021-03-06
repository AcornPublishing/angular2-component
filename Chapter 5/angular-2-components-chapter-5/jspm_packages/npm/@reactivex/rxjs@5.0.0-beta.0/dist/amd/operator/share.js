/* */ 
"format cjs";
define(["require", "exports", './multicast', '../Subject'], function (require, exports, multicast_1, Subject_1) {
    function shareSubjectFactory() {
        return new Subject_1.Subject();
    }
    function share() {
        return multicast_1.multicast.call(this, shareSubjectFactory).refCount();
    }
    exports.share = share;
    ;
});
//# sourceMappingURL=share.js.map
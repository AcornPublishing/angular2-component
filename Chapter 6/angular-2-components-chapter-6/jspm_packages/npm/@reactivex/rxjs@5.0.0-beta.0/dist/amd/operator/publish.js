/* */ 
"format cjs";
define(["require", "exports", '../Subject', './multicast'], function (require, exports, Subject_1, multicast_1) {
    function publish() {
        return multicast_1.multicast.call(this, new Subject_1.Subject());
    }
    exports.publish = publish;
});
//# sourceMappingURL=publish.js.map
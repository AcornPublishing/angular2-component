/* */ 
"format cjs";
define(["require", "exports"], function (require, exports) {
    function isScheduler(value) {
        return value && typeof value.schedule === 'function';
    }
    exports.isScheduler = isScheduler;
});
//# sourceMappingURL=isScheduler.js.map
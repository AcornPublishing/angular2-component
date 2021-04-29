/* */ 
"format cjs";
define(["require", "exports"], function (require, exports) {
    function isPromise(value) {
        return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }
    exports.isPromise = isPromise;
});
//# sourceMappingURL=isPromise.js.map
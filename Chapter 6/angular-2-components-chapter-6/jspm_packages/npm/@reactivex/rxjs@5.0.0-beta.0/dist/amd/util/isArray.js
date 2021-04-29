/* */ 
"format cjs";
define(["require", "exports"], function (require, exports) {
    exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
});
//# sourceMappingURL=isArray.js.map
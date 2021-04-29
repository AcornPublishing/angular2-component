/* */ 
"format cjs";
define(["require", "exports"], function (require, exports) {
    function isDate(value) {
        return value instanceof Date && !isNaN(+value);
    }
    exports.isDate = isDate;
});
//# sourceMappingURL=isDate.js.map
/* */ 
"format cjs";
define(["require", "exports"], function (require, exports) {
    var ArgumentOutOfRangeError = (function () {
        function ArgumentOutOfRangeError() {
            this.name = 'ArgumentOutOfRangeError';
            this.message = 'argument out of range';
        }
        return ArgumentOutOfRangeError;
    })();
    exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;
});
//# sourceMappingURL=ArgumentOutOfRangeError.js.map
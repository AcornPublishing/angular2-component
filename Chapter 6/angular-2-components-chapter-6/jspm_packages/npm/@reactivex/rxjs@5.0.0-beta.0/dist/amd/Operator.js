/* */ 
"format cjs";
define(["require", "exports", './Subscriber'], function (require, exports, Subscriber_1) {
    function defaultCallFn(observer) {
        return new Subscriber_1.Subscriber(observer);
    }
    exports.defaultCallFn = defaultCallFn;
});
//# sourceMappingURL=Operator.js.map
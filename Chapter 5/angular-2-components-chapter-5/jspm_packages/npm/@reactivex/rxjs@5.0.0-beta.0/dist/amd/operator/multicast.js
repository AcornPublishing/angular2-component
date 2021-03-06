/* */ 
"format cjs";
define(["require", "exports", '../observable/ConnectableObservable'], function (require, exports, ConnectableObservable_1) {
    function multicast(subjectOrSubjectFactory) {
        var subjectFactory;
        if (typeof subjectOrSubjectFactory === 'function') {
            subjectFactory = subjectOrSubjectFactory;
        }
        else {
            subjectFactory = function subjectFactory() {
                return subjectOrSubjectFactory;
            };
        }
        return new ConnectableObservable_1.ConnectableObservable(this, subjectFactory);
    }
    exports.multicast = multicast;
});
//# sourceMappingURL=multicast.js.map
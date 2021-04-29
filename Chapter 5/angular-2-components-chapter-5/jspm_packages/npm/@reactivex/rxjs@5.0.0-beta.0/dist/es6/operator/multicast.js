/* */ 
"format cjs";
import { ConnectableObservable } from '../observable/ConnectableObservable';
export function multicast(subjectOrSubjectFactory) {
    let subjectFactory;
    if (typeof subjectOrSubjectFactory === 'function') {
        subjectFactory = subjectOrSubjectFactory;
    }
    else {
        subjectFactory = function subjectFactory() {
            return subjectOrSubjectFactory;
        };
    }
    return new ConnectableObservable(this, subjectFactory);
}
//# sourceMappingURL=multicast.js.map
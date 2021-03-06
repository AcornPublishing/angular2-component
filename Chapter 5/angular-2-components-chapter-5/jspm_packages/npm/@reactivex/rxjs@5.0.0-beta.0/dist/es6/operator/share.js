/* */ 
"format cjs";
import { multicast } from './multicast';
import { Subject } from '../Subject';
function shareSubjectFactory() {
    return new Subject();
}
export function share() {
    return multicast.call(this, shareSubjectFactory).refCount();
}
;
//# sourceMappingURL=share.js.map
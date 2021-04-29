/* */ 
"format cjs";
import { SubscribeOnObservable } from '../observable/SubscribeOnObservable';
export function subscribeOn(scheduler, delay = 0) {
    return new SubscribeOnObservable(this, delay, scheduler);
}
//# sourceMappingURL=subscribeOn.js.map
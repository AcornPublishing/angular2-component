/* */ 
"format cjs";
import { ObserveOnOperator } from './observeOn-support';
export function observeOn(scheduler, delay = 0) {
    return this.lift(new ObserveOnOperator(scheduler, delay));
}
//# sourceMappingURL=observeOn.js.map
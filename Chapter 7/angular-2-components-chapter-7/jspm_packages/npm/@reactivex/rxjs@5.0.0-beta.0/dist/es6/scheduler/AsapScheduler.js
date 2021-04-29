/* */ 
"format cjs";
import { QueueScheduler } from './QueueScheduler';
import { AsapAction } from './AsapAction';
import { QueueAction } from './QueueAction';
export class AsapScheduler extends QueueScheduler {
    scheduleNow(work, state) {
        return (this.scheduled ?
            new QueueAction(this, work) :
            new AsapAction(this, work)).schedule(state);
    }
}
//# sourceMappingURL=AsapScheduler.js.map
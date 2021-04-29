/* */ 
"format cjs";
import { Immediate } from '../util/Immediate';
import { QueueAction } from './QueueAction';
export class AsapAction extends QueueAction {
    schedule(state) {
        if (this.isUnsubscribed) {
            return this;
        }
        this.state = state;
        const scheduler = this.scheduler;
        scheduler.actions.push(this);
        if (!scheduler.scheduled) {
            scheduler.scheduled = true;
            this.id = Immediate.setImmediate(() => {
                this.id = null;
                this.scheduler.scheduled = false;
                this.scheduler.flush();
            });
        }
        return this;
    }
    unsubscribe() {
        const id = this.id;
        const scheduler = this.scheduler;
        super.unsubscribe();
        if (scheduler.actions.length === 0) {
            scheduler.active = false;
            scheduler.scheduled = false;
        }
        if (id) {
            this.id = null;
            Immediate.clearImmediate(id);
        }
    }
}
//# sourceMappingURL=AsapAction.js.map
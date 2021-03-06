/* */ 
"format cjs";
import { Subscription } from '../Subscription';
export class QueueAction extends Subscription {
    constructor(scheduler, work) {
        super();
        this.scheduler = scheduler;
        this.work = work;
    }
    schedule(state) {
        if (this.isUnsubscribed) {
            return this;
        }
        this.state = state;
        const scheduler = this.scheduler;
        scheduler.actions.push(this);
        scheduler.flush();
        return this;
    }
    execute() {
        if (this.isUnsubscribed) {
            throw new Error('How did did we execute a canceled Action?');
        }
        this.work(this.state);
    }
    unsubscribe() {
        const scheduler = this.scheduler;
        const actions = scheduler.actions;
        const index = actions.indexOf(this);
        this.work = void 0;
        this.state = void 0;
        this.scheduler = void 0;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        super.unsubscribe();
    }
}
//# sourceMappingURL=QueueAction.js.map
/* */ 
"format cjs";
import { Observable } from '../Observable';
export class EmptyObservable extends Observable {
    constructor(scheduler) {
        super();
        this.scheduler = scheduler;
    }
    static create(scheduler) {
        return new EmptyObservable(scheduler);
    }
    static dispatch({ subscriber }) {
        subscriber.complete();
    }
    _subscribe(subscriber) {
        const scheduler = this.scheduler;
        if (scheduler) {
            subscriber.add(scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber }));
        }
        else {
            subscriber.complete();
        }
    }
}
//# sourceMappingURL=empty.js.map
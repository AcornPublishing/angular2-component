/* */ 
"format cjs";
import { Observable } from '../Observable';
import { noop } from '../util/noop';
export class InfiniteObservable extends Observable {
    constructor() {
        super();
    }
    static create() {
        return new InfiniteObservable();
    }
    _subscribe(subscriber) {
        noop();
    }
}
//# sourceMappingURL=never.js.map
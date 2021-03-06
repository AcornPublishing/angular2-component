/* */ 
"format cjs";
import { Subscriber } from './Subscriber';
export class OuterSubscriber extends Subscriber {
    notifyComplete(inner) {
        this.destination.complete();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex) {
        this.destination.next(innerValue);
    }
    notifyError(error, inner) {
        this.destination.error(error);
    }
}
//# sourceMappingURL=OuterSubscriber.js.map
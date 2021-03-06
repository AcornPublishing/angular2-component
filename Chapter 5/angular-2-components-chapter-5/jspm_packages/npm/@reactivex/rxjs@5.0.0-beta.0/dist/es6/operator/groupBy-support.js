/* */ 
"format cjs";
import { Subscription } from '../Subscription';
import { Observable } from '../Observable';
export class RefCountSubscription extends Subscription {
    constructor() {
        super();
        this.attemptedToUnsubscribePrimary = false;
        this.count = 0;
    }
    setPrimary(subscription) {
        this.primary = subscription;
    }
    unsubscribe() {
        if (!this.isUnsubscribed && !this.attemptedToUnsubscribePrimary) {
            this.attemptedToUnsubscribePrimary = true;
            if (this.count === 0) {
                super.unsubscribe();
                this.primary.unsubscribe();
            }
        }
    }
}
export class GroupedObservable extends Observable {
    constructor(key, groupSubject, refCountSubscription) {
        super();
        this.key = key;
        this.groupSubject = groupSubject;
        this.refCountSubscription = refCountSubscription;
    }
    _subscribe(subscriber) {
        const subscription = new Subscription();
        if (this.refCountSubscription && !this.refCountSubscription.isUnsubscribed) {
            subscription.add(new InnerRefCountSubscription(this.refCountSubscription));
        }
        subscription.add(this.groupSubject.subscribe(subscriber));
        return subscription;
    }
}
export class InnerRefCountSubscription extends Subscription {
    constructor(parent) {
        super();
        this.parent = parent;
        parent.count++;
    }
    unsubscribe() {
        if (!this.parent.isUnsubscribed && !this.isUnsubscribed) {
            super.unsubscribe();
            this.parent.count--;
            if (this.parent.count === 0 && this.parent.attemptedToUnsubscribePrimary) {
                this.parent.unsubscribe();
                this.parent.primary.unsubscribe();
            }
        }
    }
}
//# sourceMappingURL=groupBy-support.js.map
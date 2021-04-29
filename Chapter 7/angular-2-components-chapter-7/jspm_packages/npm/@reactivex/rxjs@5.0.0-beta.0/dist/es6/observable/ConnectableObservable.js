/* */ 
"format cjs";
import { Observable } from '../Observable';
import { Subscription } from '../Subscription';
import { Subscriber } from '../Subscriber';
export class ConnectableObservable extends Observable {
    constructor(source, subjectFactory) {
        super();
        this.source = source;
        this.subjectFactory = subjectFactory;
    }
    _subscribe(subscriber) {
        return this._getSubject().subscribe(subscriber);
    }
    _getSubject() {
        const subject = this.subject;
        if (subject && !subject.isUnsubscribed) {
            return subject;
        }
        return (this.subject = this.subjectFactory());
    }
    connect() {
        const source = this.source;
        let subscription = this.subscription;
        if (subscription && !subscription.isUnsubscribed) {
            return subscription;
        }
        subscription = source.subscribe(this._getSubject());
        subscription.add(new ConnectableSubscription(this));
        return (this.subscription = subscription);
    }
    refCount() {
        return new RefCountObservable(this);
    }
}
class ConnectableSubscription extends Subscription {
    constructor(connectable) {
        super();
        this.connectable = connectable;
    }
    _unsubscribe() {
        const connectable = this.connectable;
        connectable.subject = void 0;
        connectable.subscription = void 0;
        this.connectable = void 0;
    }
}
class RefCountObservable extends Observable {
    constructor(connectable, refCount = 0) {
        super();
        this.connectable = connectable;
        this.refCount = refCount;
    }
    _subscribe(subscriber) {
        const connectable = this.connectable;
        const refCountSubscriber = new RefCountSubscriber(subscriber, this);
        const subscription = connectable.subscribe(refCountSubscriber);
        if (!subscription.isUnsubscribed && ++this.refCount === 1) {
            refCountSubscriber.connection = this.connection = connectable.connect();
        }
        return subscription;
    }
}
class RefCountSubscriber extends Subscriber {
    constructor(destination, refCountObservable) {
        super(null);
        this.destination = destination;
        this.refCountObservable = refCountObservable;
        this.connection = refCountObservable.connection;
        destination.add(this);
    }
    _next(value) {
        this.destination.next(value);
    }
    _error(err) {
        this._resetConnectable();
        this.destination.error(err);
    }
    _complete() {
        this._resetConnectable();
        this.destination.complete();
    }
    _resetConnectable() {
        const observable = this.refCountObservable;
        const obsConnection = observable.connection;
        const subConnection = this.connection;
        if (subConnection && subConnection === obsConnection) {
            observable.refCount = 0;
            obsConnection.unsubscribe();
            observable.connection = void 0;
            this.unsubscribe();
        }
    }
    _unsubscribe() {
        const observable = this.refCountObservable;
        if (observable.refCount === 0) {
            return;
        }
        if (--observable.refCount === 0) {
            const obsConnection = observable.connection;
            const subConnection = this.connection;
            if (subConnection && subConnection === obsConnection) {
                obsConnection.unsubscribe();
                observable.connection = void 0;
            }
        }
    }
}
//# sourceMappingURL=ConnectableObservable.js.map
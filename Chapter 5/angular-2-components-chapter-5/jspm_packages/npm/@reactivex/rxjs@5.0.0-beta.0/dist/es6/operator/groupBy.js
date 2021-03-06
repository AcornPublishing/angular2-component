/* */ 
"format cjs";
import { Subscriber } from '../Subscriber';
import { Observable } from '../Observable';
import { Subject } from '../Subject';
import { Map } from '../util/Map';
import { FastMap } from '../util/FastMap';
import { RefCountSubscription, GroupedObservable } from './groupBy-support';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
export function groupBy(keySelector, elementSelector, durationSelector) {
    return new GroupByObservable(this, keySelector, elementSelector, durationSelector);
}
export class GroupByObservable extends Observable {
    constructor(source, keySelector, elementSelector, durationSelector) {
        super();
        this.source = source;
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
    }
    _subscribe(subscriber) {
        const refCountSubscription = new RefCountSubscription();
        const groupBySubscriber = new GroupBySubscriber(subscriber, refCountSubscription, this.keySelector, this.elementSelector, this.durationSelector);
        refCountSubscription.setPrimary(this.source.subscribe(groupBySubscriber));
        return refCountSubscription;
    }
}
class GroupBySubscriber extends Subscriber {
    constructor(destination, refCountSubscription, keySelector, elementSelector, durationSelector) {
        super();
        this.refCountSubscription = refCountSubscription;
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.groups = null;
        this.destination = destination;
        this.add(destination);
    }
    _next(x) {
        let key = tryCatch(this.keySelector)(x);
        if (key === errorObject) {
            this.error(key.e);
        }
        else {
            let groups = this.groups;
            const elementSelector = this.elementSelector;
            const durationSelector = this.durationSelector;
            if (!groups) {
                groups = this.groups = typeof key === 'string' ? new FastMap() : new Map();
            }
            let group = groups.get(key);
            if (!group) {
                groups.set(key, group = new Subject());
                let groupedObservable = new GroupedObservable(key, group, this.refCountSubscription);
                if (durationSelector) {
                    let duration = tryCatch(durationSelector)(new GroupedObservable(key, group));
                    if (duration === errorObject) {
                        this.error(duration.e);
                    }
                    else {
                        this.add(duration._subscribe(new GroupDurationSubscriber(key, group, this)));
                    }
                }
                this.destination.next(groupedObservable);
            }
            if (elementSelector) {
                let value = tryCatch(elementSelector)(x);
                if (value === errorObject) {
                    this.error(value.e);
                }
                else {
                    group.next(value);
                }
            }
            else {
                group.next(x);
            }
        }
    }
    _error(err) {
        const groups = this.groups;
        if (groups) {
            groups.forEach((group, key) => {
                group.error(err);
                this.removeGroup(key);
            });
        }
        this.destination.error(err);
    }
    _complete() {
        const groups = this.groups;
        if (groups) {
            groups.forEach((group, key) => {
                group.complete();
                this.removeGroup(group);
            });
        }
        this.destination.complete();
    }
    removeGroup(key) {
        this.groups.delete(key);
    }
}
class GroupDurationSubscriber extends Subscriber {
    constructor(key, group, parent) {
        super(null);
        this.key = key;
        this.group = group;
        this.parent = parent;
    }
    _next(value) {
        this.group.complete();
        this.parent.removeGroup(this.key);
    }
    _error(err) {
        this.group.error(err);
        this.parent.removeGroup(this.key);
    }
    _complete() {
        this.group.complete();
        this.parent.removeGroup(this.key);
    }
}
//# sourceMappingURL=groupBy.js.map
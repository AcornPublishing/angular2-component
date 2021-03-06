/* */ 
"format cjs";
import { global } from 'angular2/src/core/facade/lang';
export { PromiseWrapper, Promise } from 'angular2/src/core/facade/promise';
// TODO(jeffbcross): use ES6 import once typings are available
var Subject = require('@reactivex/rxjs/dist/cjs/Subject');
export class TimerWrapper {
    static setTimeout(fn, millis) {
        return global.setTimeout(fn, millis);
    }
    static clearTimeout(id) { global.clearTimeout(id); }
    static setInterval(fn, millis) {
        return global.setInterval(fn, millis);
    }
    static clearInterval(id) { global.clearInterval(id); }
}
export class ObservableWrapper {
    // TODO(vsavkin): when we use rxnext, try inferring the generic type from the first arg
    static subscribe(emitter, onNext, onThrow = null, onReturn = null) {
        return emitter.observer({ next: onNext, throw: onThrow, return: onReturn });
    }
    static isObservable(obs) { return obs instanceof Observable; }
    static dispose(subscription) { subscription.unsubscribe(); }
    static callNext(emitter, value) { emitter.next(value); }
    static callThrow(emitter, error) { emitter.throw(error); }
    static callReturn(emitter) { emitter.return(null); }
}
// TODO: vsavkin change to interface
export class Observable {
    observer(generator) { return null; }
}
/**
 * Use by directives and components to emit custom Events.
 *
 * ## Examples
 *
 * In the following example, `Zippy` alternatively emits `open` and `close` events when its
 * title gets clicked:
 *
 * ```
 * @Component({
 *   selector: 'zippy',
 *   template: `
 *   <div class="zippy">
 *     <div (click)="toggle()">Toggle</div>
 *     <div [hidden]="!visible">
 *       <ng-content></ng-content>
 *     </div>
 *  </div>`})
 * export class Zippy {
 *   visible: boolean = true;
 *   @Output() open: EventEmitter = new EventEmitter();
 *   @Output() close: EventEmitter = new EventEmitter();
 *
 *   toggle() {
 *     this.visible = !this.visible;
 *     if (this.visible) {
 *       this.open.next(null);
 *     } else {
 *       this.close.next(null);
 *     }
 *   }
 * }
 * ```
 *
 * Use Rx.Observable but provides an adapter to make it work as specified here:
 * https://github.com/jhusain/observable-spec
 *
 * Once a reference implementation of the spec is available, switch to it.
 */
export class EventEmitter extends Observable {
    constructor(...args) {
        super(...args);
        /** @internal */
        this._subject = new Subject();
    }
    observer(generator) {
        return this._subject.subscribe((value) => { setTimeout(() => generator.next(value)); }, (error) => generator.throw ? generator.throw(error) : null, () => generator.return ? generator.return() : null);
    }
    toRx() { return this._subject; }
    next(value) { this._subject.next(value); }
    throw(error) { this._subject.error(error); }
    return(value) { this._subject.complete(); }
}
//# sourceMappingURL=async.js.map
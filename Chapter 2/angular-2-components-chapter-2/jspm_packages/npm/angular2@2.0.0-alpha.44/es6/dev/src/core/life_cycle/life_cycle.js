/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/src/core/di';
import { isPresent } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { wtfLeave, wtfCreateScope } from '../profile/profile';
/**
 * Provides access to explicitly trigger change detection in an application.
 *
 * By default, `Zone` triggers change detection in Angular on each virtual machine (VM) turn. When
 * testing, or in some
 * limited application use cases, a developer can also trigger change detection with the
 * `lifecycle.tick()` method.
 *
 * Each Angular application has a single `LifeCycle` instance.
 *
 * # Example
 *
 * This is a contrived example, since the bootstrap automatically runs inside of the `Zone`, which
 * invokes
 * `lifecycle.tick()` on your behalf.
 *
 * ```javascript
 * bootstrap(MyApp).then((ref:ComponentRef) => {
 *   var lifeCycle = ref.injector.get(LifeCycle);
 *   var myApp = ref.instance;
 *
 *   ref.doSomething();
 *   lifecycle.tick();
 * });
 * ```
 */
export class LifeCycle {
}
export let LifeCycle_ = class extends LifeCycle {
    constructor(changeDetector = null, enforceNoNewChanges = false) {
        super();
        /** @internal */
        this._runningTick = false;
        this._changeDetectors = [];
        if (isPresent(changeDetector)) {
            this._changeDetectors.push(changeDetector);
        }
        this._enforceNoNewChanges = enforceNoNewChanges;
    }
    registerWith(zone, changeDetector = null) {
        if (isPresent(changeDetector)) {
            this._changeDetectors.push(changeDetector);
        }
        zone.overrideOnTurnDone(() => this.tick());
    }
    tick() {
        if (this._runningTick) {
            throw new BaseException("LifeCycle.tick is called recursively");
        }
        var s = LifeCycle_._tickScope();
        try {
            this._runningTick = true;
            this._changeDetectors.forEach((detector) => detector.detectChanges());
            if (this._enforceNoNewChanges) {
                this._changeDetectors.forEach((detector) => detector.checkNoChanges());
            }
        }
        finally {
            this._runningTick = false;
            wtfLeave(s);
        }
    }
};
LifeCycle_._tickScope = wtfCreateScope('LifeCycle#tick()');
LifeCycle_ = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Object, Boolean])
], LifeCycle_);
//# sourceMappingURL=life_cycle.js.map
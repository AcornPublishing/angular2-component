/* */ 
"format cjs";
import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { normalizeBlank, isPresent, global } from 'angular2/src/facade/lang';
import { ObservableWrapper, EventEmitter } from 'angular2/src/facade/async';
import { wtfLeave, wtfCreateScope } from '../profile/profile';
/**
 * Stores error information; delivered via [NgZone.onError] stream.
 */
export class NgZoneError {
    constructor(error, stackTrace) {
        this.error = error;
        this.stackTrace = stackTrace;
    }
}
/**
 * An injectable service for executing work inside or outside of the Angular zone.
 *
 * The most common use of this service is to optimize performance when starting a work consisting of
 * one or more asynchronous tasks that don't require UI updates or error handling to be handled by
 * Angular. Such tasks can be kicked off via {@link #runOutsideAngular} and if needed, these tasks
 * can reenter the Angular zone via {@link #run}.
 *
 * <!-- TODO: add/fix links to:
 *   - docs explaining zones and the use of zones in Angular and change-detection
 *   - link to runOutsideAngular/run (throughout this file!)
 *   -->
 *
 * ### Example ([live demo](http://plnkr.co/edit/lY9m8HLy7z06vDoUaSN2?p=preview))
 * ```
 * import {Component, View, NgZone} from 'angular2/core';
 * import {NgIf} from 'angular2/common';
 *
 * @Component({
 *   selector: 'ng-zone-demo'.
 *   template: `
 *     <h2>Demo: NgZone</h2>
 *
 *     <p>Progress: {{progress}}%</p>
 *     <p *ngIf="progress >= 100">Done processing {{label}} of Angular zone!</p>
 *
 *     <button (click)="processWithinAngularZone()">Process within Angular zone</button>
 *     <button (click)="processOutsideOfAngularZone()">Process outside of Angular zone</button>
 *   `,
 *   directives: [NgIf]
 * })
 * export class NgZoneDemo {
 *   progress: number = 0;
 *   label: string;
 *
 *   constructor(private _ngZone: NgZone) {}
 *
 *   // Loop inside the Angular zone
 *   // so the UI DOES refresh after each setTimeout cycle
 *   processWithinAngularZone() {
 *     this.label = 'inside';
 *     this.progress = 0;
 *     this._increaseProgress(() => console.log('Inside Done!'));
 *   }
 *
 *   // Loop outside of the Angular zone
 *   // so the UI DOES NOT refresh after each setTimeout cycle
 *   processOutsideOfAngularZone() {
 *     this.label = 'outside';
 *     this.progress = 0;
 *     this._ngZone.runOutsideAngular(() => {
 *       this._increaseProgress(() => {
 *       // reenter the Angular zone and display done
 *       this._ngZone.run(() => {console.log('Outside Done!') });
 *     }}));
 *   }
 *
 *
 *   _increaseProgress(doneCallback: () => void) {
 *     this.progress += 1;
 *     console.log(`Current progress: ${this.progress}%`);
 *
 *     if (this.progress < 100) {
 *       window.setTimeout(() => this._increaseProgress(doneCallback)), 10)
 *     } else {
 *       doneCallback();
 *     }
 *   }
 * }
 * ```
 */
export class NgZone {
    /**
     * @param {bool} enableLongStackTrace whether to enable long stack trace. They should only be
     *               enabled in development mode as they significantly impact perf.
     */
    constructor({ enableLongStackTrace }) {
        /** @internal */
        this._runScope = wtfCreateScope(`NgZone#run()`);
        /** @internal */
        this._microtaskScope = wtfCreateScope(`NgZone#microtask()`);
        // Number of microtasks pending from _innerZone (& descendants)
        /** @internal */
        this._pendingMicrotasks = 0;
        // Whether some code has been executed in the _innerZone (& descendants) in the current turn
        /** @internal */
        this._hasExecutedCodeInInnerZone = false;
        // run() call depth in _mountZone. 0 at the end of a macrotask
        // zone.run(() => {         // top-level call
        //   zone.run(() => {});    // nested call -> in-turn
        // });
        /** @internal */
        this._nestedRun = 0;
        /** @internal */
        this._inVmTurnDone = false;
        /** @internal */
        this._pendingTimeouts = [];
        if (global.zone) {
            this._disabled = false;
            this._mountZone = global.zone;
            this._innerZone = this._createInnerZone(this._mountZone, enableLongStackTrace);
        }
        else {
            this._disabled = true;
            this._mountZone = null;
        }
        this._onTurnStartEvents = new EventEmitter(false);
        this._onTurnDoneEvents = new EventEmitter(false);
        this._onEventDoneEvents = new EventEmitter(false);
        this._onErrorEvents = new EventEmitter(false);
    }
    /**
     * Sets the zone hook that is called just before a browser task that is handled by Angular
     * executes.
     *
     * The hook is called once per browser task that is handled by Angular.
     *
     * Setting the hook overrides any previously set hook.
     *
     * @deprecated this API will be removed in the future. Use `onTurnStart` instead.
     */
    overrideOnTurnStart(onTurnStartHook) {
        this._onTurnStart = normalizeBlank(onTurnStartHook);
    }
    /**
     * Notifies subscribers just before Angular event turn starts.
     *
     * Emits an event once per browser task that is handled by Angular.
     */
    get onTurnStart() { return this._onTurnStartEvents; }
    /** @internal */
    _notifyOnTurnStart(parentRun) {
        parentRun.call(this._innerZone, () => { this._onTurnStartEvents.emit(null); });
    }
    /**
     * Sets the zone hook that is called immediately after Angular zone is done processing the current
     * task and any microtasks scheduled from that task.
     *
     * This is where we typically do change-detection.
     *
     * The hook is called once per browser task that is handled by Angular.
     *
     * Setting the hook overrides any previously set hook.
     *
     * @deprecated this API will be removed in the future. Use `onTurnDone` instead.
     */
    overrideOnTurnDone(onTurnDoneHook) {
        this._onTurnDone = normalizeBlank(onTurnDoneHook);
    }
    /**
     * Notifies subscribers immediately after Angular zone is done processing
     * the current turn and any microtasks scheduled from that turn.
     *
     * Used by Angular as a signal to kick off change-detection.
     */
    get onTurnDone() { return this._onTurnDoneEvents; }
    /** @internal */
    _notifyOnTurnDone(parentRun) {
        parentRun.call(this._innerZone, () => { this._onTurnDoneEvents.emit(null); });
    }
    /**
     * Sets the zone hook that is called immediately after the `onTurnDone` callback is called and any
     * microstasks scheduled from within that callback are drained.
     *
     * `onEventDoneFn` is executed outside Angular zone, which means that we will no longer attempt to
     * sync the UI with any model changes that occur within this callback.
     *
     * This hook is useful for validating application state (e.g. in a test).
     *
     * Setting the hook overrides any previously set hook.
     *
     * @deprecated this API will be removed in the future. Use `onEventDone` instead.
     */
    overrideOnEventDone(onEventDoneFn, opt_waitForAsync = false) {
        var normalizedOnEventDone = normalizeBlank(onEventDoneFn);
        if (opt_waitForAsync) {
            this._onEventDone = () => {
                if (!this._pendingTimeouts.length) {
                    normalizedOnEventDone();
                }
            };
        }
        else {
            this._onEventDone = normalizedOnEventDone;
        }
    }
    /**
     * Notifies subscribers immediately after the final `onTurnDone` callback
     * before ending VM event.
     *
     * This event is useful for validating application state (e.g. in a test).
     */
    get onEventDone() { return this._onEventDoneEvents; }
    /** @internal */
    _notifyOnEventDone() {
        this.runOutsideAngular(() => { this._onEventDoneEvents.emit(null); });
    }
    /**
     * Whether there are any outstanding microtasks.
     */
    get hasPendingMicrotasks() { return this._pendingMicrotasks > 0; }
    /**
     * Whether there are any outstanding timers.
     */
    get hasPendingTimers() { return this._pendingTimeouts.length > 0; }
    /**
     * Whether there are any outstanding asychnronous tasks of any kind that are
     * scheduled to run within Angular zone.
     *
     * Useful as a signal of UI stability. For example, when a test reaches a
     * point when [hasPendingAsyncTasks] is `false` it might be a good time to run
     * test expectations.
     */
    get hasPendingAsyncTasks() { return this.hasPendingMicrotasks || this.hasPendingTimers; }
    /**
     * Sets the zone hook that is called when an error is thrown in the Angular zone.
     *
     * Setting the hook overrides any previously set hook.
     *
     * @deprecated this API will be removed in the future. Use `onError` instead.
     */
    overrideOnErrorHandler(errorHandler) {
        this._onErrorHandler = normalizeBlank(errorHandler);
    }
    get onError() { return this._onErrorEvents; }
    /**
     * Executes the `fn` function synchronously within the Angular zone and returns value returned by
     * the function.
     *
     * Running functions via `run` allows you to reenter Angular zone from a task that was executed
     * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
     *
     * Any future tasks or microtasks scheduled from within this function will continue executing from
     * within the Angular zone.
     */
    run(fn) {
        if (this._disabled) {
            return fn();
        }
        else {
            var s = this._runScope();
            try {
                return this._innerZone.run(fn);
            }
            finally {
                wtfLeave(s);
            }
        }
    }
    /**
     * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
     * the function.
     *
     * Running functions via `runOutsideAngular` allows you to escape Angular's zone and do work that
     * doesn't trigger Angular change-detection or is subject to Angular's error handling.
     *
     * Any future tasks or microtasks scheduled from within this function will continue executing from
     * outside of the Angular zone.
     *
     * Use {@link #run} to reenter the Angular zone and do work that updates the application model.
     */
    runOutsideAngular(fn) {
        if (this._disabled) {
            return fn();
        }
        else {
            return this._mountZone.run(fn);
        }
    }
    /** @internal */
    _createInnerZone(zone, enableLongStackTrace) {
        var microtaskScope = this._microtaskScope;
        var ngZone = this;
        var errorHandling;
        if (enableLongStackTrace) {
            errorHandling = StringMapWrapper.merge(Zone.longStackTraceZone, { onError: function (e) { ngZone._notifyOnError(this, e); } });
        }
        else {
            errorHandling = { onError: function (e) { ngZone._notifyOnError(this, e); } };
        }
        return zone.fork(errorHandling)
            .fork({
            '$run': function (parentRun) {
                return function () {
                    try {
                        ngZone._nestedRun++;
                        if (!ngZone._hasExecutedCodeInInnerZone) {
                            ngZone._hasExecutedCodeInInnerZone = true;
                            ngZone._notifyOnTurnStart(parentRun);
                            if (ngZone._onTurnStart) {
                                parentRun.call(ngZone._innerZone, ngZone._onTurnStart);
                            }
                        }
                        return parentRun.apply(this, arguments);
                    }
                    finally {
                        ngZone._nestedRun--;
                        // If there are no more pending microtasks, we are at the end of a VM turn (or in
                        // onTurnStart)
                        // _nestedRun will be 0 at the end of a macrotasks (it could be > 0 when there are
                        // nested calls
                        // to run()).
                        if (ngZone._pendingMicrotasks == 0 && ngZone._nestedRun == 0 &&
                            !this._inVmTurnDone) {
                            if (ngZone._hasExecutedCodeInInnerZone) {
                                try {
                                    this._inVmTurnDone = true;
                                    ngZone._notifyOnTurnDone(parentRun);
                                    if (ngZone._onTurnDone) {
                                        parentRun.call(ngZone._innerZone, ngZone._onTurnDone);
                                    }
                                }
                                finally {
                                    this._inVmTurnDone = false;
                                    ngZone._hasExecutedCodeInInnerZone = false;
                                }
                            }
                            if (ngZone._pendingMicrotasks === 0) {
                                ngZone._notifyOnEventDone();
                                if (isPresent(ngZone._onEventDone)) {
                                    ngZone.runOutsideAngular(ngZone._onEventDone);
                                }
                            }
                        }
                    }
                };
            },
            '$scheduleMicrotask': function (parentScheduleMicrotask) {
                return function (fn) {
                    ngZone._pendingMicrotasks++;
                    var microtask = function () {
                        var s = microtaskScope();
                        try {
                            fn();
                        }
                        finally {
                            ngZone._pendingMicrotasks--;
                            wtfLeave(s);
                        }
                    };
                    parentScheduleMicrotask.call(this, microtask);
                };
            },
            '$setTimeout': function (parentSetTimeout) {
                return function (fn, delay, ...args) {
                    var id;
                    var cb = function () {
                        fn();
                        ListWrapper.remove(ngZone._pendingTimeouts, id);
                    };
                    id = parentSetTimeout(cb, delay, args);
                    ngZone._pendingTimeouts.push(id);
                    return id;
                };
            },
            '$clearTimeout': function (parentClearTimeout) {
                return function (id) {
                    parentClearTimeout(id);
                    ListWrapper.remove(ngZone._pendingTimeouts, id);
                };
            },
            _innerZone: true
        });
    }
    /** @internal */
    _notifyOnError(zone, e) {
        if (isPresent(this._onErrorHandler) || ObservableWrapper.hasSubscribers(this._onErrorEvents)) {
            var trace = [normalizeBlank(e.stack)];
            while (zone && zone.constructedAtException) {
                trace.push(zone.constructedAtException.get());
                zone = zone.parent;
            }
            if (ObservableWrapper.hasSubscribers(this._onErrorEvents)) {
                ObservableWrapper.callEmit(this._onErrorEvents, new NgZoneError(e, trace));
            }
            if (isPresent(this._onErrorHandler)) {
                this._onErrorHandler(e, trace);
            }
        }
        else {
            console.log('## _notifyOnError ##');
            console.log(e.stack);
            throw e;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfem9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9jb3JlL3pvbmUvbmdfem9uZS50cyJdLCJuYW1lcyI6WyJOZ1pvbmVFcnJvciIsIk5nWm9uZUVycm9yLmNvbnN0cnVjdG9yIiwiTmdab25lIiwiTmdab25lLmNvbnN0cnVjdG9yIiwiTmdab25lLm92ZXJyaWRlT25UdXJuU3RhcnQiLCJOZ1pvbmUub25UdXJuU3RhcnQiLCJOZ1pvbmUuX25vdGlmeU9uVHVyblN0YXJ0IiwiTmdab25lLm92ZXJyaWRlT25UdXJuRG9uZSIsIk5nWm9uZS5vblR1cm5Eb25lIiwiTmdab25lLl9ub3RpZnlPblR1cm5Eb25lIiwiTmdab25lLm92ZXJyaWRlT25FdmVudERvbmUiLCJOZ1pvbmUub25FdmVudERvbmUiLCJOZ1pvbmUuX25vdGlmeU9uRXZlbnREb25lIiwiTmdab25lLmhhc1BlbmRpbmdNaWNyb3Rhc2tzIiwiTmdab25lLmhhc1BlbmRpbmdUaW1lcnMiLCJOZ1pvbmUuaGFzUGVuZGluZ0FzeW5jVGFza3MiLCJOZ1pvbmUub3ZlcnJpZGVPbkVycm9ySGFuZGxlciIsIk5nWm9uZS5vbkVycm9yIiwiTmdab25lLnJ1biIsIk5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhciIsIk5nWm9uZS5fY3JlYXRlSW5uZXJab25lIiwiTmdab25lLl9ub3RpZnlPbkVycm9yIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQztPQUNyRSxFQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFDLE1BQU0sMEJBQTBCO09BQ25FLEVBQUMsaUJBQWlCLEVBQUUsWUFBWSxFQUFDLE1BQU0sMkJBQTJCO09BQ2xFLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBYSxNQUFNLG9CQUFvQjtBQWlCdkU7O0dBRUc7QUFDSDtJQUNFQSxZQUFtQkEsS0FBVUEsRUFBU0EsVUFBZUE7UUFBbENDLFVBQUtBLEdBQUxBLEtB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QUFLQSxDQUFDQSxDQUFDQTtZQUNyQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDVkEsQ0FBQ0E7SUFDSEEsQ0FBQ0E7QUFDSG5CLENBQUNBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xpc3RXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtub3JtYWxpemVCbGFuaywgaXNQcmVzZW50LCBnbG9iYWx9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge09ic2VydmFibGVXcmFwcGVyLCBFdmVudEVtaXR0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHt3dGZMZWF2ZSwgd3RmQ3JlYXRlU2NvcGUsIFd0ZlNjb3BlRm59IGZyb20gJy4uL3Byb2ZpbGUvcHJvZmlsZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmdab25lWm9uZSBleHRlbmRzIFpvbmUge1xuICAvKiogQGludGVybmFsICovXG4gIF9pbm5lclpvbmU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBhIGZ1bmN0aW9uIHdpdGggemVybyBhcmd1bWVudHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgWmVyb0FyZ0Z1bmN0aW9uIHsgKCk6IHZvaWQ7IH1cblxuLyoqXG4gKiBGdW5jdGlvbiB0eXBlIGZvciBhbiBlcnJvciBoYW5kbGVyLCB3aGljaCB0YWtlcyBhbiBlcnJvciBhbmQgYSBzdGFjayB0cmFjZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFcnJvckhhbmRsaW5nRm4geyAoZXJyb3I6IGFueSwgc3RhY2tUcmFjZTogYW55KTogdm9pZDsgfVxuXG4vKipcbiAqIFN0b3JlcyBlcnJvciBpbmZvcm1hdGlvbjsgZGVsaXZlcmVkIHZpYSBbTmdab25lLm9uRXJyb3JdIHN0cmVhbS5cbiAqL1xuZXhwb3J0IGNsYXNzIE5nWm9uZUVycm9yIHtcbiAgY29uc3RydWN0b3IocHVibGljIGVycm9yOiBhbnksIHB1YmxpYyBzdGFja1RyYWNlOiBhbnkpIHt9XG59XG5cbi8qKlxuICogQW4gaW5qZWN0YWJsZSBzZXJ2aWNlIGZvciBleGVjdXRpbmcgd29yayBpbnNpZGUgb3Igb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLlxuICpcbiAqIFRoZSBtb3N0IGNvbW1vbiB1c2Ugb2YgdGhpcyBzZXJ2aWNlIGlzIHRvIG9wdGltaXplIHBlcmZvcm1hbmNlIHdoZW4gc3RhcnRpbmcgYSB3b3JrIGNvbnNpc3Rpbmcgb2ZcbiAqIG9uZSBvciBtb3JlIGFzeW5jaHJvbm91cyB0YXNrcyB0aGF0IGRvbid0IHJlcXVpcmUgVUkgdXBkYXRlcyBvciBlcnJvciBoYW5kbGluZyB0byBiZSBoYW5kbGVkIGJ5XG4gKiBBbmd1bGFyLiBTdWNoIHRhc2tzIGNhbiBiZSBraWNrZWQgb2ZmIHZpYSB7QGxpbmsgI3J1bk91dHNpZGVBbmd1bGFyfSBhbmQgaWYgbmVlZGVkLCB0aGVzZSB0YXNrc1xuICogY2FuIHJlZW50ZXIgdGhlIEFuZ3VsYXIgem9uZSB2aWEge0BsaW5rICNydW59LlxuICpcbiAqIDwhLS0gVE9ETzogYWRkL2ZpeCBsaW5rcyB0bzpcbiAqICAgLSBkb2NzIGV4cGxhaW5pbmcgem9uZXMgYW5kIHRoZSB1c2Ugb2Ygem9uZXMgaW4gQW5ndWxhciBhbmQgY2hhbmdlLWRldGVjdGlvblxuICogICAtIGxpbmsgdG8gcnVuT3V0c2lkZUFuZ3VsYXIvcnVuICh0aHJvdWdob3V0IHRoaXMgZmlsZSEpXG4gKiAgIC0tPlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9sWTltOEhMeTd6MDZ2RG9VYVNOMj9wPXByZXZpZXcpKVxuICogYGBgXG4gKiBpbXBvcnQge0NvbXBvbmVudCwgVmlldywgTmdab25lfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbiAqIGltcG9ydCB7TmdJZn0gZnJvbSAnYW5ndWxhcjIvY29tbW9uJztcbiAqXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICduZy16b25lLWRlbW8nLlxuICogICB0ZW1wbGF0ZTogYFxuICogICAgIDxoMj5EZW1vOiBOZ1pvbmU8L2gyPlxuICpcbiAqICAgICA8cD5Qcm9ncmVzczoge3twcm9ncmVzc319JTwvcD5cbiAqICAgICA8cCAqbmdJZj1cInByb2dyZXNzID49IDEwMFwiPkRvbmUgcHJvY2Vzc2luZyB7e2xhYmVsfX0gb2YgQW5ndWxhciB6b25lITwvcD5cbiAqXG4gKiAgICAgPGJ1dHRvbiAoY2xpY2spPVwicHJvY2Vzc1dpdGhpbkFuZ3VsYXJab25lKClcIj5Qcm9jZXNzIHdpdGhpbiBBbmd1bGFyIHpvbmU8L2J1dHRvbj5cbiAqICAgICA8YnV0dG9uIChjbGljayk9XCJwcm9jZXNzT3V0c2lkZU9mQW5ndWxhclpvbmUoKVwiPlByb2Nlc3Mgb3V0c2lkZSBvZiBBbmd1bGFyIHpvbmU8L2J1dHRvbj5cbiAqICAgYCxcbiAqICAgZGlyZWN0aXZlczogW05nSWZdXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIE5nWm9uZURlbW8ge1xuICogICBwcm9ncmVzczogbnVtYmVyID0gMDtcbiAqICAgbGFiZWw6IHN0cmluZztcbiAqXG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuICpcbiAqICAgLy8gTG9vcCBpbnNpZGUgdGhlIEFuZ3VsYXIgem9uZVxuICogICAvLyBzbyB0aGUgVUkgRE9FUyByZWZyZXNoIGFmdGVyIGVhY2ggc2V0VGltZW91dCBjeWNsZVxuICogICBwcm9jZXNzV2l0aGluQW5ndWxhclpvbmUoKSB7XG4gKiAgICAgdGhpcy5sYWJlbCA9ICdpbnNpZGUnO1xuICogICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICogICAgIHRoaXMuX2luY3JlYXNlUHJvZ3Jlc3MoKCkgPT4gY29uc29sZS5sb2coJ0luc2lkZSBEb25lIScpKTtcbiAqICAgfVxuICpcbiAqICAgLy8gTG9vcCBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmVcbiAqICAgLy8gc28gdGhlIFVJIERPRVMgTk9UIHJlZnJlc2ggYWZ0ZXIgZWFjaCBzZXRUaW1lb3V0IGN5Y2xlXG4gKiAgIHByb2Nlc3NPdXRzaWRlT2ZBbmd1bGFyWm9uZSgpIHtcbiAqICAgICB0aGlzLmxhYmVsID0gJ291dHNpZGUnO1xuICogICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICogICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gKiAgICAgICB0aGlzLl9pbmNyZWFzZVByb2dyZXNzKCgpID0+IHtcbiAqICAgICAgIC8vIHJlZW50ZXIgdGhlIEFuZ3VsYXIgem9uZSBhbmQgZGlzcGxheSBkb25lXG4gKiAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtjb25zb2xlLmxvZygnT3V0c2lkZSBEb25lIScpIH0pO1xuICogICAgIH19KSk7XG4gKiAgIH1cbiAqXG4gKlxuICogICBfaW5jcmVhc2VQcm9ncmVzcyhkb25lQ2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAqICAgICB0aGlzLnByb2dyZXNzICs9IDE7XG4gKiAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgcHJvZ3Jlc3M6ICR7dGhpcy5wcm9ncmVzc30lYCk7XG4gKlxuICogICAgIGlmICh0aGlzLnByb2dyZXNzIDwgMTAwKSB7XG4gKiAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLl9pbmNyZWFzZVByb2dyZXNzKGRvbmVDYWxsYmFjaykpLCAxMClcbiAqICAgICB9IGVsc2Uge1xuICogICAgICAgZG9uZUNhbGxiYWNrKCk7XG4gKiAgICAgfVxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIE5nWm9uZSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3J1blNjb3BlOiBXdGZTY29wZUZuID0gd3RmQ3JlYXRlU2NvcGUoYE5nWm9uZSNydW4oKWApO1xuICAvKiogQGludGVybmFsICovXG4gIF9taWNyb3Rhc2tTY29wZTogV3RmU2NvcGVGbiA9IHd0ZkNyZWF0ZVNjb3BlKGBOZ1pvbmUjbWljcm90YXNrKClgKTtcblxuICAvLyBDb2RlIGV4ZWN1dGVkIGluIF9tb3VudFpvbmUgZG9lcyBub3QgdHJpZ2dlciB0aGUgb25UdXJuRG9uZS5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbW91bnRab25lO1xuICAvLyBfaW5uZXJab25lIGlzIHRoZSBjaGlsZCBvZiBfbW91bnRab25lLiBBbnkgY29kZSBleGVjdXRlZCBpbiB0aGlzIHpvbmUgd2lsbCB0cmlnZ2VyIHRoZVxuICAvLyBvblR1cm5Eb25lIGhvb2sgYXQgdGhlIGVuZCBvZiB0aGUgY3VycmVudCBWTSB0dXJuLlxuICAvKiogQGludGVybmFsICovXG4gIF9pbm5lclpvbmU7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25UdXJuU3RhcnQ6IFplcm9BcmdGdW5jdGlvbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25UdXJuRG9uZTogWmVyb0FyZ0Z1bmN0aW9uO1xuICAvKiogQGludGVybmFsICovXG4gIF9vbkV2ZW50RG9uZTogWmVyb0FyZ0Z1bmN0aW9uO1xuICAvKiogQGludGVybmFsICovXG4gIF9vbkVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGluZ0ZuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uVHVyblN0YXJ0RXZlbnRzOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25UdXJuRG9uZUV2ZW50czogRXZlbnRFbWl0dGVyPGFueT47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uRXZlbnREb25lRXZlbnRzOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25FcnJvckV2ZW50czogRXZlbnRFbWl0dGVyPGFueT47XG5cbiAgLy8gTnVtYmVyIG9mIG1pY3JvdGFza3MgcGVuZGluZyBmcm9tIF9pbm5lclpvbmUgKCYgZGVzY2VuZGFudHMpXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdNaWNyb3Rhc2tzOiBudW1iZXIgPSAwO1xuICAvLyBXaGV0aGVyIHNvbWUgY29kZSBoYXMgYmVlbiBleGVjdXRlZCBpbiB0aGUgX2lubmVyWm9uZSAoJiBkZXNjZW5kYW50cykgaW4gdGhlIGN1cnJlbnQgdHVyblxuICAvKiogQGludGVybmFsICovXG4gIF9oYXNFeGVjdXRlZENvZGVJbklubmVyWm9uZTogYm9vbGVhbiA9IGZhbHNlO1xuICAvLyBydW4oKSBjYWxsIGRlcHRoIGluIF9tb3VudFpvbmUuIDAgYXQgdGhlIGVuZCBvZiBhIG1hY3JvdGFza1xuICAvLyB6b25lLnJ1bigoKSA9PiB7ICAgICAgICAgLy8gdG9wLWxldmVsIGNhbGxcbiAgLy8gICB6b25lLnJ1bigoKSA9PiB7fSk7ICAgIC8vIG5lc3RlZCBjYWxsIC0+IGluLXR1cm5cbiAgLy8gfSk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX25lc3RlZFJ1bjogbnVtYmVyID0gMDtcblxuICAvLyBUT0RPKHZpY2IpOiBpbXBsZW1lbnQgdGhpcyBjbGFzcyBwcm9wZXJseSBmb3Igbm9kZS5qcyBlbnZpcm9ubWVudFxuICAvLyBUaGlzIGRpc2FibGVkIGZsYWcgaXMgb25seSBoZXJlIHRvIHBsZWFzZSBjanMgdGVzdHNcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5WbVR1cm5Eb25lOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ1RpbWVvdXRzOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Jvb2x9IGVuYWJsZUxvbmdTdGFja1RyYWNlIHdoZXRoZXIgdG8gZW5hYmxlIGxvbmcgc3RhY2sgdHJhY2UuIFRoZXkgc2hvdWxkIG9ubHkgYmVcbiAgICogICAgICAgICAgICAgICBlbmFibGVkIGluIGRldmVsb3BtZW50IG1vZGUgYXMgdGhleSBzaWduaWZpY2FudGx5IGltcGFjdCBwZXJmLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioe2VuYWJsZUxvbmdTdGFja1RyYWNlfSkge1xuICAgIGlmIChnbG9iYWwuem9uZSkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX21vdW50Wm9uZSA9IGdsb2JhbC56b25lO1xuICAgICAgdGhpcy5faW5uZXJab25lID0gdGhpcy5fY3JlYXRlSW5uZXJab25lKHRoaXMuX21vdW50Wm9uZSwgZW5hYmxlTG9uZ1N0YWNrVHJhY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IHRydWU7XG4gICAgICB0aGlzLl9tb3VudFpvbmUgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLl9vblR1cm5TdGFydEV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXIoZmFsc2UpO1xuICAgIHRoaXMuX29uVHVybkRvbmVFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyKGZhbHNlKTtcbiAgICB0aGlzLl9vbkV2ZW50RG9uZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXIoZmFsc2UpO1xuICAgIHRoaXMuX29uRXJyb3JFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyKGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB6b25lIGhvb2sgdGhhdCBpcyBjYWxsZWQganVzdCBiZWZvcmUgYSBicm93c2VyIHRhc2sgdGhhdCBpcyBoYW5kbGVkIGJ5IEFuZ3VsYXJcbiAgICogZXhlY3V0ZXMuXG4gICAqXG4gICAqIFRoZSBob29rIGlzIGNhbGxlZCBvbmNlIHBlciBicm93c2VyIHRhc2sgdGhhdCBpcyBoYW5kbGVkIGJ5IEFuZ3VsYXIuXG4gICAqXG4gICAqIFNldHRpbmcgdGhlIGhvb2sgb3ZlcnJpZGVzIGFueSBwcmV2aW91c2x5IHNldCBob29rLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB0aGlzIEFQSSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZS4gVXNlIGBvblR1cm5TdGFydGAgaW5zdGVhZC5cbiAgICovXG4gIG92ZXJyaWRlT25UdXJuU3RhcnQob25UdXJuU3RhcnRIb29rOiBaZXJvQXJnRnVuY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9vblR1cm5TdGFydCA9IG5vcm1hbGl6ZUJsYW5rKG9uVHVyblN0YXJ0SG9vayk7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZpZXMgc3Vic2NyaWJlcnMganVzdCBiZWZvcmUgQW5ndWxhciBldmVudCB0dXJuIHN0YXJ0cy5cbiAgICpcbiAgICogRW1pdHMgYW4gZXZlbnQgb25jZSBwZXIgYnJvd3NlciB0YXNrIHRoYXQgaXMgaGFuZGxlZCBieSBBbmd1bGFyLlxuICAgKi9cbiAgZ2V0IG9uVHVyblN0YXJ0KCk6IC8qIFN1YmplY3QgKi8gYW55IHsgcmV0dXJuIHRoaXMuX29uVHVyblN0YXJ0RXZlbnRzOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbm90aWZ5T25UdXJuU3RhcnQocGFyZW50UnVuKTogdm9pZCB7XG4gICAgcGFyZW50UnVuLmNhbGwodGhpcy5faW5uZXJab25lLCAoKSA9PiB7IHRoaXMuX29uVHVyblN0YXJ0RXZlbnRzLmVtaXQobnVsbCk7IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHpvbmUgaG9vayB0aGF0IGlzIGNhbGxlZCBpbW1lZGlhdGVseSBhZnRlciBBbmd1bGFyIHpvbmUgaXMgZG9uZSBwcm9jZXNzaW5nIHRoZSBjdXJyZW50XG4gICAqIHRhc2sgYW5kIGFueSBtaWNyb3Rhc2tzIHNjaGVkdWxlZCBmcm9tIHRoYXQgdGFzay5cbiAgICpcbiAgICogVGhpcyBpcyB3aGVyZSB3ZSB0eXBpY2FsbHkgZG8gY2hhbmdlLWRldGVjdGlvbi5cbiAgICpcbiAgICogVGhlIGhvb2sgaXMgY2FsbGVkIG9uY2UgcGVyIGJyb3dzZXIgdGFzayB0aGF0IGlzIGhhbmRsZWQgYnkgQW5ndWxhci5cbiAgICpcbiAgICogU2V0dGluZyB0aGUgaG9vayBvdmVycmlkZXMgYW55IHByZXZpb3VzbHkgc2V0IGhvb2suXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHRoaXMgQVBJIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLiBVc2UgYG9uVHVybkRvbmVgIGluc3RlYWQuXG4gICAqL1xuICBvdmVycmlkZU9uVHVybkRvbmUob25UdXJuRG9uZUhvb2s6IFplcm9BcmdGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMuX29uVHVybkRvbmUgPSBub3JtYWxpemVCbGFuayhvblR1cm5Eb25lSG9vayk7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZpZXMgc3Vic2NyaWJlcnMgaW1tZWRpYXRlbHkgYWZ0ZXIgQW5ndWxhciB6b25lIGlzIGRvbmUgcHJvY2Vzc2luZ1xuICAgKiB0aGUgY3VycmVudCB0dXJuIGFuZCBhbnkgbWljcm90YXNrcyBzY2hlZHVsZWQgZnJvbSB0aGF0IHR1cm4uXG4gICAqXG4gICAqIFVzZWQgYnkgQW5ndWxhciBhcyBhIHNpZ25hbCB0byBraWNrIG9mZiBjaGFuZ2UtZGV0ZWN0aW9uLlxuICAgKi9cbiAgZ2V0IG9uVHVybkRvbmUoKSB7IHJldHVybiB0aGlzLl9vblR1cm5Eb25lRXZlbnRzOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbm90aWZ5T25UdXJuRG9uZShwYXJlbnRSdW4pOiB2b2lkIHtcbiAgICBwYXJlbnRSdW4uY2FsbCh0aGlzLl9pbm5lclpvbmUsICgpID0+IHsgdGhpcy5fb25UdXJuRG9uZUV2ZW50cy5lbWl0KG51bGwpOyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB6b25lIGhvb2sgdGhhdCBpcyBjYWxsZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGBvblR1cm5Eb25lYCBjYWxsYmFjayBpcyBjYWxsZWQgYW5kIGFueVxuICAgKiBtaWNyb3N0YXNrcyBzY2hlZHVsZWQgZnJvbSB3aXRoaW4gdGhhdCBjYWxsYmFjayBhcmUgZHJhaW5lZC5cbiAgICpcbiAgICogYG9uRXZlbnREb25lRm5gIGlzIGV4ZWN1dGVkIG91dHNpZGUgQW5ndWxhciB6b25lLCB3aGljaCBtZWFucyB0aGF0IHdlIHdpbGwgbm8gbG9uZ2VyIGF0dGVtcHQgdG9cbiAgICogc3luYyB0aGUgVUkgd2l0aCBhbnkgbW9kZWwgY2hhbmdlcyB0aGF0IG9jY3VyIHdpdGhpbiB0aGlzIGNhbGxiYWNrLlxuICAgKlxuICAgKiBUaGlzIGhvb2sgaXMgdXNlZnVsIGZvciB2YWxpZGF0aW5nIGFwcGxpY2F0aW9uIHN0YXRlIChlLmcuIGluIGEgdGVzdCkuXG4gICAqXG4gICAqIFNldHRpbmcgdGhlIGhvb2sgb3ZlcnJpZGVzIGFueSBwcmV2aW91c2x5IHNldCBob29rLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB0aGlzIEFQSSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZS4gVXNlIGBvbkV2ZW50RG9uZWAgaW5zdGVhZC5cbiAgICovXG4gIG92ZXJyaWRlT25FdmVudERvbmUob25FdmVudERvbmVGbjogWmVyb0FyZ0Z1bmN0aW9uLCBvcHRfd2FpdEZvckFzeW5jOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICB2YXIgbm9ybWFsaXplZE9uRXZlbnREb25lID0gbm9ybWFsaXplQmxhbmsob25FdmVudERvbmVGbik7XG4gICAgaWYgKG9wdF93YWl0Rm9yQXN5bmMpIHtcbiAgICAgIHRoaXMuX29uRXZlbnREb25lID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuX3BlbmRpbmdUaW1lb3V0cy5sZW5ndGgpIHtcbiAgICAgICAgICBub3JtYWxpemVkT25FdmVudERvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb25FdmVudERvbmUgPSBub3JtYWxpemVkT25FdmVudERvbmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmaWVzIHN1YnNjcmliZXJzIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBmaW5hbCBgb25UdXJuRG9uZWAgY2FsbGJhY2tcbiAgICogYmVmb3JlIGVuZGluZyBWTSBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyB1c2VmdWwgZm9yIHZhbGlkYXRpbmcgYXBwbGljYXRpb24gc3RhdGUgKGUuZy4gaW4gYSB0ZXN0KS5cbiAgICovXG4gIGdldCBvbkV2ZW50RG9uZSgpIHsgcmV0dXJuIHRoaXMuX29uRXZlbnREb25lRXZlbnRzOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbm90aWZ5T25FdmVudERvbmUoKTogdm9pZCB7XG4gICAgdGhpcy5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7IHRoaXMuX29uRXZlbnREb25lRXZlbnRzLmVtaXQobnVsbCk7IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlcmUgYXJlIGFueSBvdXRzdGFuZGluZyBtaWNyb3Rhc2tzLlxuICAgKi9cbiAgZ2V0IGhhc1BlbmRpbmdNaWNyb3Rhc2tzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcGVuZGluZ01pY3JvdGFza3MgPiAwOyB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlcmUgYXJlIGFueSBvdXRzdGFuZGluZyB0aW1lcnMuXG4gICAqL1xuICBnZXQgaGFzUGVuZGluZ1RpbWVycygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3BlbmRpbmdUaW1lb3V0cy5sZW5ndGggPiAwOyB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlcmUgYXJlIGFueSBvdXRzdGFuZGluZyBhc3ljaG5yb25vdXMgdGFza3Mgb2YgYW55IGtpbmQgdGhhdCBhcmVcbiAgICogc2NoZWR1bGVkIHRvIHJ1biB3aXRoaW4gQW5ndWxhciB6b25lLlxuICAgKlxuICAgKiBVc2VmdWwgYXMgYSBzaWduYWwgb2YgVUkgc3RhYmlsaXR5LiBGb3IgZXhhbXBsZSwgd2hlbiBhIHRlc3QgcmVhY2hlcyBhXG4gICAqIHBvaW50IHdoZW4gW2hhc1BlbmRpbmdBc3luY1Rhc2tzXSBpcyBgZmFsc2VgIGl0IG1pZ2h0IGJlIGEgZ29vZCB0aW1lIHRvIHJ1blxuICAgKiB0ZXN0IGV4cGVjdGF0aW9ucy5cbiAgICovXG4gIGdldCBoYXNQZW5kaW5nQXN5bmNUYXNrcygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzUGVuZGluZ01pY3JvdGFza3MgfHwgdGhpcy5oYXNQZW5kaW5nVGltZXJzOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHpvbmUgaG9vayB0aGF0IGlzIGNhbGxlZCB3aGVuIGFuIGVycm9yIGlzIHRocm93biBpbiB0aGUgQW5ndWxhciB6b25lLlxuICAgKlxuICAgKiBTZXR0aW5nIHRoZSBob29rIG92ZXJyaWRlcyBhbnkgcHJldmlvdXNseSBzZXQgaG9vay5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdGhpcyBBUEkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUuIFVzZSBgb25FcnJvcmAgaW5zdGVhZC5cbiAgICovXG4gIG92ZXJyaWRlT25FcnJvckhhbmRsZXIoZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsaW5nRm4pIHtcbiAgICB0aGlzLl9vbkVycm9ySGFuZGxlciA9IG5vcm1hbGl6ZUJsYW5rKGVycm9ySGFuZGxlcik7XG4gIH1cblxuICBnZXQgb25FcnJvcigpIHsgcmV0dXJuIHRoaXMuX29uRXJyb3JFdmVudHM7IH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgdGhlIGBmbmAgZnVuY3Rpb24gc3luY2hyb25vdXNseSB3aXRoaW4gdGhlIEFuZ3VsYXIgem9uZSBhbmQgcmV0dXJucyB2YWx1ZSByZXR1cm5lZCBieVxuICAgKiB0aGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIFJ1bm5pbmcgZnVuY3Rpb25zIHZpYSBgcnVuYCBhbGxvd3MgeW91IHRvIHJlZW50ZXIgQW5ndWxhciB6b25lIGZyb20gYSB0YXNrIHRoYXQgd2FzIGV4ZWN1dGVkXG4gICAqIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZSAodHlwaWNhbGx5IHN0YXJ0ZWQgdmlhIHtAbGluayAjcnVuT3V0c2lkZUFuZ3VsYXJ9KS5cbiAgICpcbiAgICogQW55IGZ1dHVyZSB0YXNrcyBvciBtaWNyb3Rhc2tzIHNjaGVkdWxlZCBmcm9tIHdpdGhpbiB0aGlzIGZ1bmN0aW9uIHdpbGwgY29udGludWUgZXhlY3V0aW5nIGZyb21cbiAgICogd2l0aGluIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAqL1xuICBydW4oZm46ICgpID0+IGFueSk6IGFueSB7XG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHMgPSB0aGlzLl9ydW5TY29wZSgpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyWm9uZS5ydW4oZm4pO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd3RmTGVhdmUocyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHRoZSBgZm5gIGZ1bmN0aW9uIHN5bmNocm9ub3VzbHkgaW4gQW5ndWxhcidzIHBhcmVudCB6b25lIGFuZCByZXR1cm5zIHZhbHVlIHJldHVybmVkIGJ5XG4gICAqIHRoZSBmdW5jdGlvbi5cbiAgICpcbiAgICogUnVubmluZyBmdW5jdGlvbnMgdmlhIGBydW5PdXRzaWRlQW5ndWxhcmAgYWxsb3dzIHlvdSB0byBlc2NhcGUgQW5ndWxhcidzIHpvbmUgYW5kIGRvIHdvcmsgdGhhdFxuICAgKiBkb2Vzbid0IHRyaWdnZXIgQW5ndWxhciBjaGFuZ2UtZGV0ZWN0aW9uIG9yIGlzIHN1YmplY3QgdG8gQW5ndWxhcidzIGVycm9yIGhhbmRsaW5nLlxuICAgKlxuICAgKiBBbnkgZnV0dXJlIHRhc2tzIG9yIG1pY3JvdGFza3Mgc2NoZWR1bGVkIGZyb20gd2l0aGluIHRoaXMgZnVuY3Rpb24gd2lsbCBjb250aW51ZSBleGVjdXRpbmcgZnJvbVxuICAgKiBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAqXG4gICAqIFVzZSB7QGxpbmsgI3J1bn0gdG8gcmVlbnRlciB0aGUgQW5ndWxhciB6b25lIGFuZCBkbyB3b3JrIHRoYXQgdXBkYXRlcyB0aGUgYXBwbGljYXRpb24gbW9kZWwuXG4gICAqL1xuICBydW5PdXRzaWRlQW5ndWxhcihmbjogKCkgPT4gYW55KTogYW55IHtcbiAgICBpZiAodGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybiBmbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW91bnRab25lLnJ1bihmbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY3JlYXRlSW5uZXJab25lKHpvbmUsIGVuYWJsZUxvbmdTdGFja1RyYWNlKSB7XG4gICAgdmFyIG1pY3JvdGFza1Njb3BlID0gdGhpcy5fbWljcm90YXNrU2NvcGU7XG4gICAgdmFyIG5nWm9uZSA9IHRoaXM7XG4gICAgdmFyIGVycm9ySGFuZGxpbmc7XG5cbiAgICBpZiAoZW5hYmxlTG9uZ1N0YWNrVHJhY2UpIHtcbiAgICAgIGVycm9ySGFuZGxpbmcgPSBTdHJpbmdNYXBXcmFwcGVyLm1lcmdlKFxuICAgICAgICAgIFpvbmUubG9uZ1N0YWNrVHJhY2Vab25lLCB7b25FcnJvcjogZnVuY3Rpb24oZSkgeyBuZ1pvbmUuX25vdGlmeU9uRXJyb3IodGhpcywgZSk7IH19KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JIYW5kbGluZyA9IHtvbkVycm9yOiBmdW5jdGlvbihlKSB7IG5nWm9uZS5fbm90aWZ5T25FcnJvcih0aGlzLCBlKTsgfX07XG4gICAgfVxuXG4gICAgcmV0dXJuIHpvbmUuZm9yayhlcnJvckhhbmRsaW5nKVxuICAgICAgICAuZm9yayh7XG4gICAgICAgICAgJyRydW4nOiBmdW5jdGlvbihwYXJlbnRSdW4pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBuZ1pvbmUuX25lc3RlZFJ1bisrO1xuICAgICAgICAgICAgICAgIGlmICghbmdab25lLl9oYXNFeGVjdXRlZENvZGVJbklubmVyWm9uZSkge1xuICAgICAgICAgICAgICAgICAgbmdab25lLl9oYXNFeGVjdXRlZENvZGVJbklubmVyWm9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBuZ1pvbmUuX25vdGlmeU9uVHVyblN0YXJ0KHBhcmVudFJ1bik7XG4gICAgICAgICAgICAgICAgICBpZiAobmdab25lLl9vblR1cm5TdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRSdW4uY2FsbChuZ1pvbmUuX2lubmVyWm9uZSwgbmdab25lLl9vblR1cm5TdGFydCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnRSdW4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBuZ1pvbmUuX25lc3RlZFJ1bi0tO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBtb3JlIHBlbmRpbmcgbWljcm90YXNrcywgd2UgYXJlIGF0IHRoZSBlbmQgb2YgYSBWTSB0dXJuIChvciBpblxuICAgICAgICAgICAgICAgIC8vIG9uVHVyblN0YXJ0KVxuICAgICAgICAgICAgICAgIC8vIF9uZXN0ZWRSdW4gd2lsbCBiZSAwIGF0IHRoZSBlbmQgb2YgYSBtYWNyb3Rhc2tzIChpdCBjb3VsZCBiZSA+IDAgd2hlbiB0aGVyZSBhcmVcbiAgICAgICAgICAgICAgICAvLyBuZXN0ZWQgY2FsbHNcbiAgICAgICAgICAgICAgICAvLyB0byBydW4oKSkuXG4gICAgICAgICAgICAgICAgaWYgKG5nWm9uZS5fcGVuZGluZ01pY3JvdGFza3MgPT0gMCAmJiBuZ1pvbmUuX25lc3RlZFJ1biA9PSAwICYmXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLl9pblZtVHVybkRvbmUpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChuZ1pvbmUuX2hhc0V4ZWN1dGVkQ29kZUluSW5uZXJab25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5WbVR1cm5Eb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICBuZ1pvbmUuX25vdGlmeU9uVHVybkRvbmUocGFyZW50UnVuKTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAobmdab25lLl9vblR1cm5Eb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRSdW4uY2FsbChuZ1pvbmUuX2lubmVyWm9uZSwgbmdab25lLl9vblR1cm5Eb25lKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5WbVR1cm5Eb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgbmdab25lLl9oYXNFeGVjdXRlZENvZGVJbklubmVyWm9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGlmIChuZ1pvbmUuX3BlbmRpbmdNaWNyb3Rhc2tzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nWm9uZS5fbm90aWZ5T25FdmVudERvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUHJlc2VudChuZ1pvbmUuX29uRXZlbnREb25lKSkge1xuICAgICAgICAgICAgICAgICAgICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcihuZ1pvbmUuX29uRXZlbnREb25lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICckc2NoZWR1bGVNaWNyb3Rhc2snOiBmdW5jdGlvbihwYXJlbnRTY2hlZHVsZU1pY3JvdGFzaykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICAgIG5nWm9uZS5fcGVuZGluZ01pY3JvdGFza3MrKztcbiAgICAgICAgICAgICAgdmFyIG1pY3JvdGFzayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzID0gbWljcm90YXNrU2NvcGUoKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgbmdab25lLl9wZW5kaW5nTWljcm90YXNrcy0tO1xuICAgICAgICAgICAgICAgICAgd3RmTGVhdmUocyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBwYXJlbnRTY2hlZHVsZU1pY3JvdGFzay5jYWxsKHRoaXMsIG1pY3JvdGFzayk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJyRzZXRUaW1lb3V0JzogZnVuY3Rpb24ocGFyZW50U2V0VGltZW91dCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGZuOiBGdW5jdGlvbiwgZGVsYXk6IG51bWJlciwgLi4uYXJncykge1xuICAgICAgICAgICAgICB2YXIgaWQ7XG4gICAgICAgICAgICAgIHZhciBjYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgTGlzdFdyYXBwZXIucmVtb3ZlKG5nWm9uZS5fcGVuZGluZ1RpbWVvdXRzLCBpZCk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGlkID0gcGFyZW50U2V0VGltZW91dChjYiwgZGVsYXksIGFyZ3MpO1xuICAgICAgICAgICAgICBuZ1pvbmUuX3BlbmRpbmdUaW1lb3V0cy5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICckY2xlYXJUaW1lb3V0JzogZnVuY3Rpb24ocGFyZW50Q2xlYXJUaW1lb3V0KSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaWQ6IG51bWJlcikge1xuICAgICAgICAgICAgICBwYXJlbnRDbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICAgICAgICBMaXN0V3JhcHBlci5yZW1vdmUobmdab25lLl9wZW5kaW5nVGltZW91dHMsIGlkKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBfaW5uZXJab25lOiB0cnVlXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbm90aWZ5T25FcnJvcih6b25lLCBlKTogdm9pZCB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9vbkVycm9ySGFuZGxlcikgfHwgT2JzZXJ2YWJsZVdyYXBwZXIuaGFzU3Vic2NyaWJlcnModGhpcy5fb25FcnJvckV2ZW50cykpIHtcbiAgICAgIHZhciB0cmFjZSA9IFtub3JtYWxpemVCbGFuayhlLnN0YWNrKV07XG5cbiAgICAgIHdoaWxlICh6b25lICYmIHpvbmUuY29uc3RydWN0ZWRBdEV4Y2VwdGlvbikge1xuICAgICAgICB0cmFjZS5wdXNoKHpvbmUuY29uc3RydWN0ZWRBdEV4Y2VwdGlvbi5nZXQoKSk7XG4gICAgICAgIHpvbmUgPSB6b25lLnBhcmVudDtcbiAgICAgIH1cbiAgICAgIGlmIChPYnNlcnZhYmxlV3JhcHBlci5oYXNTdWJzY3JpYmVycyh0aGlzLl9vbkVycm9yRXZlbnRzKSkge1xuICAgICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLl9vbkVycm9yRXZlbnRzLCBuZXcgTmdab25lRXJyb3IoZSwgdHJhY2UpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1ByZXNlbnQodGhpcy5fb25FcnJvckhhbmRsZXIpKSB7XG4gICAgICAgIHRoaXMuX29uRXJyb3JIYW5kbGVyKGUsIHRyYWNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJyMjIF9ub3RpZnlPbkVycm9yICMjJyk7XG4gICAgICBjb25zb2xlLmxvZyhlLnN0YWNrKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG59XG4iXX0=
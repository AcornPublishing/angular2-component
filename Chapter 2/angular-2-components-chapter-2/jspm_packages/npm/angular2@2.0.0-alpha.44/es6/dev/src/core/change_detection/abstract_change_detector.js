/* */ 
"format cjs";
import { isPresent, isBlank } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { ListWrapper } from 'angular2/src/core/facade/collection';
import { ChangeDetectionUtil } from './change_detection_util';
import { ChangeDetectorRef_ } from './change_detector_ref';
import { ChangeDetectionError, ExpressionChangedAfterItHasBeenCheckedException, DehydratedException } from './exceptions';
import { ChangeDetectionStrategy } from './constants';
import { wtfCreateScope, wtfLeave } from '../profile/profile';
import { isObservable } from './observable_facade';
var _scope_check = wtfCreateScope(`ChangeDetector#check(ascii id, bool throwOnChange)`);
class _Context {
    constructor(element, componentElement, context, locals, injector, expression) {
        this.element = element;
        this.componentElement = componentElement;
        this.context = context;
        this.locals = locals;
        this.injector = injector;
        this.expression = expression;
    }
}
export class AbstractChangeDetector {
    constructor(id, dispatcher, numberOfPropertyProtoRecords, bindingTargets, directiveIndices, strategy) {
        this.id = id;
        this.dispatcher = dispatcher;
        this.numberOfPropertyProtoRecords = numberOfPropertyProtoRecords;
        this.bindingTargets = bindingTargets;
        this.directiveIndices = directiveIndices;
        this.strategy = strategy;
        this.lightDomChildren = [];
        this.shadowDomChildren = [];
        // The names of the below fields must be kept in sync with codegen_name_util.ts or
        // change detection will fail.
        this.alreadyChecked = false;
        this.locals = null;
        this.mode = null;
        this.pipes = null;
        this.ref = new ChangeDetectorRef_(this);
    }
    addChild(cd) {
        this.lightDomChildren.push(cd);
        cd.parent = this;
    }
    removeChild(cd) { ListWrapper.remove(this.lightDomChildren, cd); }
    addShadowDomChild(cd) {
        this.shadowDomChildren.push(cd);
        cd.parent = this;
    }
    removeShadowDomChild(cd) { ListWrapper.remove(this.shadowDomChildren, cd); }
    remove() { this.parent.removeChild(this); }
    handleEvent(eventName, elIndex, locals) {
        var res = this.handleEventInternal(eventName, elIndex, locals);
        this.markPathToRootAsCheckOnce();
        return res;
    }
    handleEventInternal(eventName, elIndex, locals) { return false; }
    detectChanges() { this.runDetectChanges(false); }
    checkNoChanges() { throw new BaseException("Not implemented"); }
    runDetectChanges(throwOnChange) {
        if (this.mode === ChangeDetectionStrategy.Detached ||
            this.mode === ChangeDetectionStrategy.Checked)
            return;
        var s = _scope_check(this.id, throwOnChange);
        this.detectChangesInRecords(throwOnChange);
        this._detectChangesInLightDomChildren(throwOnChange);
        if (!throwOnChange)
            this.afterContentLifecycleCallbacks();
        this._detectChangesInShadowDomChildren(throwOnChange);
        if (!throwOnChange)
            this.afterViewLifecycleCallbacks();
        if (this.mode === ChangeDetectionStrategy.CheckOnce)
            this.mode = ChangeDetectionStrategy.Checked;
        this.alreadyChecked = true;
        wtfLeave(s);
    }
    // This method is not intended to be overridden. Subclasses should instead provide an
    // implementation of `detectChangesInRecordsInternal` which does the work of detecting changes
    // and which this method will call.
    // This method expects that `detectChangesInRecordsInternal` will set the property
    // `this.propertyBindingIndex` to the propertyBindingIndex of the first proto record. This is to
    // facilitate error reporting.
    detectChangesInRecords(throwOnChange) {
        if (!this.hydrated()) {
            this.throwDehydratedError();
        }
        try {
            this.detectChangesInRecordsInternal(throwOnChange);
        }
        catch (e) {
            this._throwError(e, e.stack);
        }
    }
    // Subclasses should override this method to perform any work necessary to detect and report
    // changes. For example, changes should be reported via `ChangeDetectionUtil.addChange`, lifecycle
    // methods should be called, etc.
    // This implementation should also set `this.propertyBindingIndex` to the propertyBindingIndex of
    // the
    // first proto record to facilitate error reporting. See {@link #detectChangesInRecords}.
    detectChangesInRecordsInternal(throwOnChange) { }
    // This method is not intended to be overridden. Subclasses should instead provide an
    // implementation of `hydrateDirectives`.
    hydrate(context, locals, directives, pipes) {
        this.mode = ChangeDetectionUtil.changeDetectionMode(this.strategy);
        this.context = context;
        if (this.strategy === ChangeDetectionStrategy.OnPushObserve) {
            this.observeComponent(context);
        }
        this.locals = locals;
        this.pipes = pipes;
        this.hydrateDirectives(directives);
        this.alreadyChecked = false;
    }
    // Subclasses should override this method to hydrate any directives.
    hydrateDirectives(directives) { }
    // This method is not intended to be overridden. Subclasses should instead provide an
    // implementation of `dehydrateDirectives`.
    dehydrate() {
        this.dehydrateDirectives(true);
        // This is an experimental feature. Works only in Dart.
        if (this.strategy === ChangeDetectionStrategy.OnPushObserve) {
            this._unsubsribeFromObservables();
        }
        this.context = null;
        this.locals = null;
        this.pipes = null;
    }
    // Subclasses should override this method to dehydrate any directives. This method should reverse
    // any work done in `hydrateDirectives`.
    dehydrateDirectives(destroyPipes) { }
    hydrated() { return this.context !== null; }
    afterContentLifecycleCallbacks() {
        this.dispatcher.notifyAfterContentChecked();
        this.afterContentLifecycleCallbacksInternal();
    }
    afterContentLifecycleCallbacksInternal() { }
    afterViewLifecycleCallbacks() {
        this.dispatcher.notifyAfterViewChecked();
        this.afterViewLifecycleCallbacksInternal();
    }
    afterViewLifecycleCallbacksInternal() { }
    /** @internal */
    _detectChangesInLightDomChildren(throwOnChange) {
        var c = this.lightDomChildren;
        for (var i = 0; i < c.length; ++i) {
            c[i].runDetectChanges(throwOnChange);
        }
    }
    /** @internal */
    _detectChangesInShadowDomChildren(throwOnChange) {
        var c = this.shadowDomChildren;
        for (var i = 0; i < c.length; ++i) {
            c[i].runDetectChanges(throwOnChange);
        }
    }
    markAsCheckOnce() { this.mode = ChangeDetectionStrategy.CheckOnce; }
    markPathToRootAsCheckOnce() {
        var c = this;
        while (isPresent(c) && c.mode !== ChangeDetectionStrategy.Detached) {
            if (c.mode === ChangeDetectionStrategy.Checked)
                c.mode = ChangeDetectionStrategy.CheckOnce;
            c = c.parent;
        }
    }
    // This is an experimental feature. Works only in Dart.
    _unsubsribeFromObservables() {
        if (isPresent(this.subscriptions)) {
            for (var i = 0; i < this.subscriptions.length; ++i) {
                var s = this.subscriptions[i];
                if (isPresent(this.subscriptions[i])) {
                    s.cancel();
                    this.subscriptions[i] = null;
                }
            }
        }
    }
    // This is an experimental feature. Works only in Dart.
    observeValue(value, index) {
        if (isObservable(value)) {
            this._createArrayToStoreObservables();
            if (isBlank(this.subscriptions[index])) {
                this.streams[index] = value.changes;
                this.subscriptions[index] = value.changes.listen((_) => this.ref.markForCheck());
            }
            else if (this.streams[index] !== value.changes) {
                this.subscriptions[index].cancel();
                this.streams[index] = value.changes;
                this.subscriptions[index] = value.changes.listen((_) => this.ref.markForCheck());
            }
        }
        return value;
    }
    // This is an experimental feature. Works only in Dart.
    observeDirective(value, index) {
        if (isObservable(value)) {
            this._createArrayToStoreObservables();
            var arrayIndex = this.numberOfPropertyProtoRecords + index + 2; // +1 is component
            this.streams[arrayIndex] = value.changes;
            this.subscriptions[arrayIndex] = value.changes.listen((_) => this.ref.markForCheck());
        }
        return value;
    }
    // This is an experimental feature. Works only in Dart.
    observeComponent(value) {
        if (isObservable(value)) {
            this._createArrayToStoreObservables();
            var index = this.numberOfPropertyProtoRecords + 1;
            this.streams[index] = value.changes;
            this.subscriptions[index] = value.changes.listen((_) => this.ref.markForCheck());
        }
        return value;
    }
    _createArrayToStoreObservables() {
        if (isBlank(this.subscriptions)) {
            this.subscriptions = ListWrapper.createFixedSize(this.numberOfPropertyProtoRecords +
                this.directiveIndices.length + 2);
            this.streams = ListWrapper.createFixedSize(this.numberOfPropertyProtoRecords +
                this.directiveIndices.length + 2);
        }
    }
    getDirectiveFor(directives, index) {
        return directives.getDirectiveFor(this.directiveIndices[index]);
    }
    getDetectorFor(directives, index) {
        return directives.getDetectorFor(this.directiveIndices[index]);
    }
    notifyDispatcher(value) {
        this.dispatcher.notifyOnBinding(this._currentBinding(), value);
    }
    logBindingUpdate(value) {
        this.dispatcher.logBindingUpdate(this._currentBinding(), value);
    }
    addChange(changes, oldValue, newValue) {
        if (isBlank(changes)) {
            changes = {};
        }
        changes[this._currentBinding().name] = ChangeDetectionUtil.simpleChange(oldValue, newValue);
        return changes;
    }
    _throwError(exception, stack) {
        var error;
        try {
            var c = this.dispatcher.getDebugContext(this._currentBinding().elementIndex, null);
            var context = isPresent(c) ? new _Context(c.element, c.componentElement, c.context, c.locals, c.injector, this._currentBinding().debug) :
                null;
            error = new ChangeDetectionError(this._currentBinding().debug, exception, stack, context);
        }
        catch (e) {
            // if an error happens during getting the debug context, we throw a ChangeDetectionError
            // without the extra information.
            error = new ChangeDetectionError(null, exception, stack, null);
        }
        throw error;
    }
    throwOnChangeError(oldValue, newValue) {
        throw new ExpressionChangedAfterItHasBeenCheckedException(this._currentBinding().debug, oldValue, newValue, null);
    }
    throwDehydratedError() { throw new DehydratedException(); }
    _currentBinding() {
        return this.bindingTargets[this.propertyBindingIndex];
    }
}
//# sourceMappingURL=abstract_change_detector.js.map
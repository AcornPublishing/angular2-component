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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Directive } from 'angular2/src/core/metadata';
import { Host } from 'angular2/src/core/di';
import { ViewContainerRef, TemplateRef } from 'angular2/src/core/linker';
import { isPresent, isBlank, normalizeBlank, CONST_EXPR } from 'angular2/src/core/facade/lang';
import { ListWrapper, Map } from 'angular2/src/core/facade/collection';
const _WHEN_DEFAULT = CONST_EXPR(new Object());
export class SwitchView {
    constructor(_viewContainerRef, _templateRef) {
        this._viewContainerRef = _viewContainerRef;
        this._templateRef = _templateRef;
    }
    create() { this._viewContainerRef.createEmbeddedView(this._templateRef); }
    destroy() { this._viewContainerRef.clear(); }
}
/**
 * The `NgSwitch` directive is used to conditionally swap DOM structure on your template based on a
 * scope expression.
 * Elements within `NgSwitch` but without `NgSwitchWhen` or `NgSwitchDefault` directives will be
 * preserved at the location as specified in the template.
 *
 * `NgSwitch` simply chooses nested elements and makes them visible based on which element matches
 * the value obtained from the evaluated expression. In other words, you define a container element
 * (where you place the directive), place an expression on the **`[ng-switch]="..."` attribute**),
 * define any inner elements inside of the directive and place a `[ng-switch-when]` attribute per
 * element.
 * The when attribute is used to inform NgSwitch which element to display when the expression is
 * evaluated. If a matching expression is not found via a when attribute then an element with the
 * default attribute is displayed.
 *
 * # Example:
 *
 * ```
 * <ANY [ng-switch]="expression">
 *   <template [ng-switch-when]="whenExpression1">...</template>
 *   <template [ng-switch-when]="whenExpression1">...</template>
 *   <template ng-switch-default>...</template>
 * </ANY>
 * ```
 */
export let NgSwitch = class {
    constructor() {
        this._useDefault = false;
        this._valueViews = new Map();
        this._activeViews = [];
    }
    set ngSwitch(value) {
        // Empty the currently active ViewContainers
        this._emptyAllActiveViews();
        // Add the ViewContainers matching the value (with a fallback to default)
        this._useDefault = false;
        var views = this._valueViews.get(value);
        if (isBlank(views)) {
            this._useDefault = true;
            views = normalizeBlank(this._valueViews.get(_WHEN_DEFAULT));
        }
        this._activateViews(views);
        this._switchValue = value;
    }
    /** @internal */
    _onWhenValueChanged(oldWhen, newWhen, view) {
        this._deregisterView(oldWhen, view);
        this._registerView(newWhen, view);
        if (oldWhen === this._switchValue) {
            view.destroy();
            ListWrapper.remove(this._activeViews, view);
        }
        else if (newWhen === this._switchValue) {
            if (this._useDefault) {
                this._useDefault = false;
                this._emptyAllActiveViews();
            }
            view.create();
            this._activeViews.push(view);
        }
        // Switch to default when there is no more active ViewContainers
        if (this._activeViews.length === 0 && !this._useDefault) {
            this._useDefault = true;
            this._activateViews(this._valueViews.get(_WHEN_DEFAULT));
        }
    }
    /** @internal */
    _emptyAllActiveViews() {
        var activeContainers = this._activeViews;
        for (var i = 0; i < activeContainers.length; i++) {
            activeContainers[i].destroy();
        }
        this._activeViews = [];
    }
    /** @internal */
    _activateViews(views) {
        // TODO(vicb): assert(this._activeViews.length === 0);
        if (isPresent(views)) {
            for (var i = 0; i < views.length; i++) {
                views[i].create();
            }
            this._activeViews = views;
        }
    }
    /** @internal */
    _registerView(value, view) {
        var views = this._valueViews.get(value);
        if (isBlank(views)) {
            views = [];
            this._valueViews.set(value, views);
        }
        views.push(view);
    }
    /** @internal */
    _deregisterView(value, view) {
        // `_WHEN_DEFAULT` is used a marker for non-registered whens
        if (value === _WHEN_DEFAULT)
            return;
        var views = this._valueViews.get(value);
        if (views.length == 1) {
            this._valueViews.delete(value);
        }
        else {
            ListWrapper.remove(views, view);
        }
    }
};
NgSwitch = __decorate([
    Directive({ selector: '[ng-switch]', inputs: ['ngSwitch'] }), 
    __metadata('design:paramtypes', [])
], NgSwitch);
/**
 * Defines a case statement as an expression.
 *
 * If multiple `NgSwitchWhen` match the `NgSwitch` value, all of them are displayed.
 *
 * Example:
 *
 * ```
 * // match against a context variable
 * <template [ng-switch-when]="contextVariable">...</template>
 *
 * // match against a constant string
 * <template ng-switch-when="stringValue">...</template>
 * ```
 */
export let NgSwitchWhen = class {
    constructor(viewContainer, templateRef, _switch) {
        this._switch = _switch;
        // `_WHEN_DEFAULT` is used as a marker for a not yet initialized value
        /** @internal */
        this._value = _WHEN_DEFAULT;
        this._view = new SwitchView(viewContainer, templateRef);
    }
    set ngSwitchWhen(value) {
        this._switch._onWhenValueChanged(this._value, value, this._view);
        this._value = value;
    }
};
NgSwitchWhen = __decorate([
    Directive({ selector: '[ng-switch-when]', inputs: ['ngSwitchWhen'] }),
    __param(2, Host()), 
    __metadata('design:paramtypes', [ViewContainerRef, TemplateRef, NgSwitch])
], NgSwitchWhen);
/**
 * Defines a default case statement.
 *
 * Default case statements are displayed when no `NgSwitchWhen` match the `ng-switch` value.
 *
 * Example:
 *
 * ```
 * <template ng-switch-default>...</template>
 * ```
 */
export let NgSwitchDefault = class {
    constructor(viewContainer, templateRef, sswitch) {
        sswitch._registerView(_WHEN_DEFAULT, new SwitchView(viewContainer, templateRef));
    }
};
NgSwitchDefault = __decorate([
    Directive({ selector: '[ng-switch-default]' }),
    __param(2, Host()), 
    __metadata('design:paramtypes', [ViewContainerRef, TemplateRef, NgSwitch])
], NgSwitchDefault);
//# sourceMappingURL=ng_switch.js.map
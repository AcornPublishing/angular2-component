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
import { Injector, Injectable } from 'angular2/src/core/di';
import { isPresent } from 'angular2/src/core/facade/lang';
import { MapWrapper } from 'angular2/src/core/facade/collection';
import { DirectiveResolver } from 'angular2/src/core/linker/directive_resolver';
import { ViewResolver } from 'angular2/src/core/linker/view_resolver';
import { internalView } from 'angular2/src/core/linker/view_ref';
import { DynamicComponentLoader } from 'angular2/src/core/linker/dynamic_component_loader';
import { el } from './utils';
import { DOCUMENT } from 'angular2/src/core/render/render';
import { DOM } from 'angular2/src/core/dom/dom_adapter';
import { DebugElement_ } from 'angular2/src/core/debug/debug_element';
export class RootTestComponent {
}
export class RootTestComponent_ extends RootTestComponent {
    constructor(componentRef) {
        super();
        this.debugElement = new DebugElement_(internalView(componentRef.hostView), 0);
        this._componentParentView = internalView(componentRef.hostView);
        this._componentRef = componentRef;
    }
    detectChanges() {
        this._componentParentView.changeDetector.detectChanges();
        this._componentParentView.changeDetector.checkNoChanges();
    }
    destroy() { this._componentRef.dispose(); }
}
var _nextRootElementId = 0;
/**
 * Builds a RootTestComponent for use in component level tests.
 */
export let TestComponentBuilder = class {
    constructor(_injector) {
        this._injector = _injector;
        /** @internal */
        this._bindingsOverrides = new Map();
        /** @internal */
        this._directiveOverrides = new Map();
        /** @internal */
        this._templateOverrides = new Map();
        /** @internal */
        this._viewBindingsOverrides = new Map();
        /** @internal */
        this._viewOverrides = new Map();
    }
    /** @internal */
    _clone() {
        var clone = new TestComponentBuilder(this._injector);
        clone._viewOverrides = MapWrapper.clone(this._viewOverrides);
        clone._directiveOverrides = MapWrapper.clone(this._directiveOverrides);
        clone._templateOverrides = MapWrapper.clone(this._templateOverrides);
        return clone;
    }
    /**
     * Overrides only the html of a {@link ComponentMetadata}.
     * All the other properties of the component's {@link ViewMetadata} are preserved.
     *
     * @param {Type} component
     * @param {string} html
     *
     * @return {TestComponentBuilder}
     */
    overrideTemplate(componentType, template) {
        var clone = this._clone();
        clone._templateOverrides.set(componentType, template);
        return clone;
    }
    /**
     * Overrides a component's {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {view} View
     *
     * @return {TestComponentBuilder}
     */
    overrideView(componentType, view) {
        var clone = this._clone();
        clone._viewOverrides.set(componentType, view);
        return clone;
    }
    /**
     * Overrides the directives from the component {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     *
     * @return {TestComponentBuilder}
     */
    overrideDirective(componentType, from, to) {
        var clone = this._clone();
        var overridesForComponent = clone._directiveOverrides.get(componentType);
        if (!isPresent(overridesForComponent)) {
            clone._directiveOverrides.set(componentType, new Map());
            overridesForComponent = clone._directiveOverrides.get(componentType);
        }
        overridesForComponent.set(from, to);
        return clone;
    }
    /**
     * Overrides one or more injectables configured via `providers` metadata property of a directive
     * or
     * component.
     * Very useful when certain providers need to be mocked out.
     *
     * The providers specified via this method are appended to the existing `providers` causing the
     * duplicated providers to
     * be overridden.
     *
     * @param {Type} component
     * @param {any[]} providers
     *
     * @return {TestComponentBuilder}
     */
    overrideProviders(type, providers) {
        var clone = this._clone();
        clone._bindingsOverrides.set(type, providers);
        return clone;
    }
    /**
     * @deprecated
     */
    overrideBindings(type, providers) {
        return this.overrideProviders(type, providers);
    }
    /**
     * Overrides one or more injectables configured via `providers` metadata property of a directive
     * or
     * component.
     * Very useful when certain providers need to be mocked out.
     *
     * The providers specified via this method are appended to the existing `providers` causing the
     * duplicated providers to
     * be overridden.
     *
     * @param {Type} component
     * @param {any[]} providers
     *
     * @return {TestComponentBuilder}
     */
    overrideViewProviders(type, providers) {
        var clone = this._clone();
        clone._viewBindingsOverrides.set(type, providers);
        return clone;
    }
    /**
     * @deprecated
     */
    overrideViewBindings(type, providers) {
        return this.overrideViewProviders(type, providers);
    }
    /**
     * Builds and returns a RootTestComponent.
     *
     * @return {Promise<RootTestComponent>}
     */
    createAsync(rootComponentType) {
        var mockDirectiveResolver = this._injector.get(DirectiveResolver);
        var mockViewResolver = this._injector.get(ViewResolver);
        this._viewOverrides.forEach((view, type) => mockViewResolver.setView(type, view));
        this._templateOverrides.forEach((template, type) => mockViewResolver.setInlineTemplate(type, template));
        this._directiveOverrides.forEach((overrides, component) => {
            overrides.forEach((to, from) => { mockViewResolver.overrideViewDirective(component, from, to); });
        });
        this._bindingsOverrides.forEach((bindings, type) => mockDirectiveResolver.setBindingsOverride(type, bindings));
        this._viewBindingsOverrides.forEach((bindings, type) => mockDirectiveResolver.setViewBindingsOverride(type, bindings));
        var rootElId = `root${_nextRootElementId++}`;
        var rootEl = el(`<div id="${rootElId}"></div>`);
        var doc = this._injector.get(DOCUMENT);
        // TODO(juliemr): can/should this be optional?
        var oldRoots = DOM.querySelectorAll(doc, '[id^=root]');
        for (var i = 0; i < oldRoots.length; i++) {
            DOM.remove(oldRoots[i]);
        }
        DOM.appendChild(doc.body, rootEl);
        return this._injector.get(DynamicComponentLoader)
            .loadAsRoot(rootComponentType, `#${rootElId}`, this._injector)
            .then((componentRef) => { return new RootTestComponent_(componentRef); });
    }
};
TestComponentBuilder = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Injector])
], TestComponentBuilder);
//# sourceMappingURL=test_component_builder.js.map
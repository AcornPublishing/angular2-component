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
import { ViewMetadata } from '../metadata/view';
import { ComponentMetadata } from '../metadata/directives';
import { stringify, isBlank, isPresent } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { Map } from 'angular2/src/core/facade/collection';
import { reflector } from 'angular2/src/core/reflection/reflection';
export let ViewResolver = class {
    constructor() {
        /** @internal */
        this._cache = new Map();
    }
    resolve(component) {
        var view = this._cache.get(component);
        if (isBlank(view)) {
            view = this._resolve(component);
            this._cache.set(component, view);
        }
        return view;
    }
    /** @internal */
    _resolve(component) {
        var compMeta;
        var viewMeta;
        reflector.annotations(component).forEach(m => {
            if (m instanceof ViewMetadata) {
                viewMeta = m;
            }
            if (m instanceof ComponentMetadata) {
                compMeta = m;
            }
        });
        if (isPresent(compMeta)) {
            if (isBlank(compMeta.template) && isBlank(compMeta.templateUrl) && isBlank(viewMeta)) {
                throw new BaseException(`Component '${stringify(component)}' must have either 'template', 'templateUrl', or '@View' set.`);
            }
            else if (isPresent(compMeta.template) && isPresent(viewMeta)) {
                this._throwMixingViewAndComponent("template", component);
            }
            else if (isPresent(compMeta.templateUrl) && isPresent(viewMeta)) {
                this._throwMixingViewAndComponent("templateUrl", component);
            }
            else if (isPresent(compMeta.directives) && isPresent(viewMeta)) {
                this._throwMixingViewAndComponent("directives", component);
            }
            else if (isPresent(compMeta.pipes) && isPresent(viewMeta)) {
                this._throwMixingViewAndComponent("pipes", component);
            }
            else if (isPresent(compMeta.encapsulation) && isPresent(viewMeta)) {
                this._throwMixingViewAndComponent("encapsulation", component);
            }
            else if (isPresent(compMeta.styles) && isPresent(viewMeta)) {
                this._throwMixingViewAndComponent("styles", component);
            }
            else if (isPresent(compMeta.styleUrls) && isPresent(viewMeta)) {
                this._throwMixingViewAndComponent("styleUrls", component);
            }
            else if (isPresent(viewMeta)) {
                return viewMeta;
            }
            else {
                return new ViewMetadata({
                    templateUrl: compMeta.templateUrl,
                    template: compMeta.template,
                    directives: compMeta.directives,
                    pipes: compMeta.pipes,
                    encapsulation: compMeta.encapsulation,
                    styles: compMeta.styles,
                    styleUrls: compMeta.styleUrls
                });
            }
        }
        else {
            if (isBlank(viewMeta)) {
                throw new BaseException(`No View decorator found on component '${stringify(component)}'`);
            }
            else {
                return viewMeta;
            }
        }
        return null;
    }
    /** @internal */
    _throwMixingViewAndComponent(propertyName, component) {
        throw new BaseException(`Component '${stringify(component)}' cannot have both '${propertyName}' and '@View' set at the same time"`);
    }
};
ViewResolver = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], ViewResolver);
//# sourceMappingURL=view_resolver.js.map
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
import { DOM } from 'angular2/src/core/dom/dom_adapter';
import { Injectable } from 'angular2/angular2';
import { LocationStrategy, normalizeQueryParams } from './location_strategy';
/**
 * `PathLocationStrategy` is a {@link LocationStrategy} used to configure the
 * {@link Location} service to represent its state in the
 * [path](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax) of the
 * browser's URL.
 *
 * `PathLocationStrategy` is the default binding for {@link LocationStrategy}
 * provided in {@link ROUTER_PROVIDERS}.
 *
 * If you're using `PathLocationStrategy`, you must provide a provider for
 * {@link APP_BASE_HREF} to a string representing the URL prefix that should
 * be preserved when generating and recognizing URLs.
 *
 * For instance, if you provide an `APP_BASE_HREF` of `'/my/app'` and call
 * `location.go('/foo')`, the browser's URL will become
 * `example.com/my/app/foo`.
 *
 * ## Example
 *
 * ```
 * import {Component, provide} from 'angular2/angular2';
 * import {
 *   APP_BASE_HREF
 *   ROUTER_DIRECTIVES,
 *   ROUTER_PROVIDERS,
 *   RouteConfig,
 *   Location
 * } from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   constructor(location: Location) {
 *     location.go('/foo');
 *   }
 * }
 *
 * bootstrap(AppCmp, [
 *   ROUTER_PROVIDERS, // includes binding to PathLocationStrategy
 *   provide(APP_BASE_HREF, {useValue: '/my/app'})
 * ]);
 * ```
 */
export let PathLocationStrategy = class extends LocationStrategy {
    constructor() {
        super();
        this._location = DOM.getLocation();
        this._history = DOM.getHistory();
        this._baseHref = DOM.getBaseHref();
    }
    onPopState(fn) {
        DOM.getGlobalEventTarget('window').addEventListener('popstate', fn, false);
    }
    getBaseHref() { return this._baseHref; }
    path() { return this._location.pathname + normalizeQueryParams(this._location.search); }
    pushState(state, title, url, queryParams) {
        this._history.pushState(state, title, (url + normalizeQueryParams(queryParams)));
    }
    forward() { this._history.forward(); }
    back() { this._history.back(); }
};
PathLocationStrategy = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], PathLocationStrategy);
//# sourceMappingURL=path_location_strategy.js.map
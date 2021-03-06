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
import { LocationStrategy } from './location_strategy';
import { isPresent, CONST_EXPR } from 'angular2/src/core/facade/lang';
import { EventEmitter, ObservableWrapper } from 'angular2/src/core/facade/async';
import { isBlank } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { OpaqueToken, Injectable, Optional, Inject } from 'angular2/angular2';
/**
 * The `APP_BASE_HREF` token represents the base href to be used with the
 * {@link PathLocationStrategy}.
 *
 * If you're using {@link PathLocationStrategy}, you must provide a provider to a string
 * representing the URL prefix that should be preserved when generating and recognizing
 * URLs.
 *
 * ## Example
 *
 * ```
 * import {Component} from 'angular2/angular2';
 * import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   // ...
 * }
 *
 * bootstrap(AppCmp, [
 *   ROUTER_PROVIDERS,
 *   PathLocationStrategy,
 *   provide(APP_BASE_HREF, {useValue: '/my/app'})
 * ]);
 * ```
 */
export const APP_BASE_HREF = CONST_EXPR(new OpaqueToken('appBaseHref'));
/**
 * `Location` is a service that applications can use to interact with a browser's URL.
 * Depending on which {@link LocationStrategy} is used, `Location` will either persist
 * to the URL's path or the URL's hash segment.
 *
 * Note: it's better to use {@link Router#navigate} service to trigger route changes. Use
 * `Location` only if you need to interact with or create normalized URLs outside of
 * routing.
 *
 * `Location` is responsible for normalizing the URL against the application's base href.
 * A normalized URL is absolute from the URL host, includes the application's base href, and has no
 * trailing slash:
 * - `/my/app/user/123` is normalized
 * - `my/app/user/123` **is not** normalized
 * - `/my/app/user/123/` **is not** normalized
 *
 * ## Example
 *
 * ```
 * import {Component} from 'angular2/angular2';
 * import {
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
 * bootstrap(AppCmp, [ROUTER_PROVIDERS]);
 * ```
 */
export let Location = class {
    constructor(platformStrategy, href) {
        this.platformStrategy = platformStrategy;
        /** @internal */
        this._subject = new EventEmitter();
        var browserBaseHref = isPresent(href) ? href : this.platformStrategy.getBaseHref();
        if (isBlank(browserBaseHref)) {
            throw new BaseException(`No base href set. Either provide a provider for the APP_BASE_HREF token or add a base element to the document.`);
        }
        this._baseHref = stripTrailingSlash(stripIndexHtml(browserBaseHref));
        this.platformStrategy.onPopState((_) => { ObservableWrapper.callNext(this._subject, { 'url': this.path(), 'pop': true }); });
    }
    /**
     * Returns the normalized URL path.
     */
    path() { return this.normalize(this.platformStrategy.path()); }
    /**
     * Given a string representing a URL, returns the normalized URL path.
     */
    normalize(url) {
        return stripTrailingSlash(_stripBaseHref(this._baseHref, stripIndexHtml(url)));
    }
    /**
     * Given a string representing a URL, returns the normalized URL path.
     * If the given URL doesn't begin with a leading slash (`'/'`), this method adds one
     * before normalizing.
     */
    normalizeAbsolutely(url) {
        if (!url.startsWith('/')) {
            url = '/' + url;
        }
        return stripTrailingSlash(_addBaseHref(this._baseHref, url));
    }
    /**
     * Changes the browsers URL to the normalized version of the given URL, and pushes a
     * new item onto the platform's history.
     */
    go(path, query = '') {
        var absolutePath = this.normalizeAbsolutely(path);
        this.platformStrategy.pushState(null, '', absolutePath, query);
    }
    /**
     * Navigates forward in the platform's history.
     */
    forward() { this.platformStrategy.forward(); }
    /**
     * Navigates back in the platform's history.
     */
    back() { this.platformStrategy.back(); }
    /**
     * Subscribe to the platform's `popState` events.
     */
    subscribe(onNext, onThrow = null, onReturn = null) {
        ObservableWrapper.subscribe(this._subject, onNext, onThrow, onReturn);
    }
};
Location = __decorate([
    Injectable(),
    __param(1, Optional()),
    __param(1, Inject(APP_BASE_HREF)), 
    __metadata('design:paramtypes', [LocationStrategy, String])
], Location);
function _stripBaseHref(baseHref, url) {
    if (baseHref.length > 0 && url.startsWith(baseHref)) {
        return url.substring(baseHref.length);
    }
    return url;
}
function _addBaseHref(baseHref, url) {
    if (!url.startsWith(baseHref)) {
        return baseHref + url;
    }
    return url;
}
function stripIndexHtml(url) {
    if (/\/index.html$/g.test(url)) {
        // '/index.html'.length == 11
        return url.substring(0, url.length - 11);
    }
    return url;
}
function stripTrailingSlash(url) {
    if (/\/$/g.test(url)) {
        url = url.substring(0, url.length - 1);
    }
    return url;
}
//# sourceMappingURL=location.js.map
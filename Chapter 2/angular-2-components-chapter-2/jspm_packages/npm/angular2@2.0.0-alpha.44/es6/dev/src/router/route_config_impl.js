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
import { CONST } from 'angular2/src/core/facade/lang';
/**
 * The `RouteConfig` decorator defines routes for a given component.
 *
 * It takes an array of {@link RouteDefinition}s.
 */
export let RouteConfig = class {
    constructor(configs) {
        this.configs = configs;
    }
};
RouteConfig = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Array])
], RouteConfig);
/**
 * `Route` is a type of {@link RouteDefinition} used to route a path to a component.
 *
 * It has the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `component` a component type.
 * - `as` is an optional `CamelCase` string representing the name of the route.
 * - `data` is an optional property of any type representing arbitrary route metadata for the given
 * route. It is injectable via the {@link ROUTE_DATA} token.
 *
 * ## Example
 * ```
 * import {RouteConfig} from 'angular2/router';
 *
 * @RouteConfig([
 *   {path: '/home', component: HomeCmp, as: 'HomeCmp' }
 * ])
 * class MyApp {}
 * ```
 */
export let Route = class {
    constructor({ path, component, as, data }) {
        this.path = path;
        this.component = component;
        this.as = as;
        this.loader = null;
        this.redirectTo = null;
        this.data = data;
    }
};
Route = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Route);
/**
 * `AuxRoute` is a type of {@link RouteDefinition} used to define an auxiliary route.
 *
 * It takes an object with the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `component` a component type.
 * - `as` is an optional `CamelCase` string representing the name of the route.
 * - `data` is an optional property of any type representing arbitrary route metadata for the given
 * route. It is injectable via the {@link ROUTE_DATA} token.
 *
 * ## Example
 * ```
 * import {RouteConfig, AuxRoute} from 'angular2/router';
 *
 * @RouteConfig([
 *   new AuxRoute({path: '/home', component: HomeCmp})
 * ])
 * class MyApp {}
 * ```
 */
export let AuxRoute = class {
    constructor({ path, component, as }) {
        this.data = null;
        // added next two properties to work around https://github.com/Microsoft/TypeScript/issues/4107
        this.loader = null;
        this.redirectTo = null;
        this.path = path;
        this.component = component;
        this.as = as;
    }
};
AuxRoute = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], AuxRoute);
/**
 * `AsyncRoute` is a type of {@link RouteDefinition} used to route a path to an asynchronously
 * loaded component.
 *
 * It has the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `loader` is a function that returns a promise that resolves to a component.
 * - `as` is an optional `CamelCase` string representing the name of the route.
 * - `data` is an optional property of any type representing arbitrary route metadata for the given
 * route. It is injectable via the {@link ROUTE_DATA} token.
 *
 * ## Example
 * ```
 * import {RouteConfig} from 'angular2/router';
 *
 * @RouteConfig([
 *   {path: '/home', loader: () => Promise.resolve(MyLoadedCmp), as: 'MyLoadedCmp'}
 * ])
 * class MyApp {}
 * ```
 */
export let AsyncRoute = class {
    constructor({ path, loader, as, data }) {
        this.path = path;
        this.loader = loader;
        this.as = as;
        this.data = data;
    }
};
AsyncRoute = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], AsyncRoute);
/**
 * `Redirect` is a type of {@link RouteDefinition} used to route a path to an asynchronously loaded
 * component.
 *
 * It has the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `redirectTo` is a string representing the new URL to be matched against.
 *
 * ## Example
 * ```
 * import {RouteConfig} from 'angular2/router';
 *
 * @RouteConfig([
 *   {path: '/', redirectTo: '/home'},
 *   {path: '/home', component: HomeCmp}
 * ])
 * class MyApp {}
 * ```
 */
export let Redirect = class {
    constructor({ path, redirectTo }) {
        this.as = null;
        // added next property to work around https://github.com/Microsoft/TypeScript/issues/4107
        this.loader = null;
        this.data = null;
        this.path = path;
        this.redirectTo = redirectTo;
    }
};
Redirect = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Redirect);
//# sourceMappingURL=route_config_impl.js.map
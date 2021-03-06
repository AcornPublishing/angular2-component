/* */ 
"format cjs";
/**
 * @module
 * @description
 * Maps application URLs into application states, to support deep-linking and navigation.
 */
export { Router } from './src/router/router';
export { RouterOutlet } from './src/router/router_outlet';
export { RouterLink } from './src/router/router_link';
export { RouteParams, RouteData } from './src/router/instruction';
export { PlatformLocation } from './src/router/platform_location';
export { RouteRegistry, ROUTER_PRIMARY_COMPONENT } from './src/router/route_registry';
export { LocationStrategy, APP_BASE_HREF } from './src/router/location_strategy';
export { HashLocationStrategy } from './src/router/hash_location_strategy';
export { PathLocationStrategy } from './src/router/path_location_strategy';
export { Location } from './src/router/location';
export * from './src/router/route_config_decorator';
export * from './src/router/route_definition';
export { CanActivate } from './src/router/lifecycle_annotations';
export { Instruction, ComponentInstruction } from './src/router/instruction';
export { OpaqueToken } from 'angular2/core';
import { PlatformLocation } from './src/router/platform_location';
import { LocationStrategy } from './src/router/location_strategy';
import { PathLocationStrategy } from './src/router/path_location_strategy';
import { Router, RootRouter } from './src/router/router';
import { RouterOutlet } from './src/router/router_outlet';
import { RouterLink } from './src/router/router_link';
import { RouteRegistry, ROUTER_PRIMARY_COMPONENT } from './src/router/route_registry';
import { Location } from './src/router/location';
import { ApplicationRef, Provider } from 'angular2/core';
import { CONST_EXPR } from './src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * A list of directives. To use the router directives like {@link RouterOutlet} and
 * {@link RouterLink}, add this to your `directives` array in the {@link View} decorator of your
 * component.
 *
 * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *    // ...
 * }
 *
 * bootstrap(AppCmp, [ROUTER_PROVIDERS]);
 * ```
 */
export const ROUTER_DIRECTIVES = CONST_EXPR([RouterOutlet, RouterLink]);
/**
 * A list of {@link Provider}s. To use the router, you must add this to your application.
 *
 * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {
 *   ROUTER_DIRECTIVES,
 *   ROUTER_PROVIDERS,
 *   RouteConfig
 * } from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   // ...
 * }
 *
 * bootstrap(AppCmp, [ROUTER_PROVIDERS]);
 * ```
 */
export const ROUTER_PROVIDERS = CONST_EXPR([
    RouteRegistry,
    CONST_EXPR(new Provider(LocationStrategy, { useClass: PathLocationStrategy })),
    PlatformLocation,
    Location,
    CONST_EXPR(new Provider(Router, {
        useFactory: routerFactory,
        deps: CONST_EXPR([RouteRegistry, Location, ROUTER_PRIMARY_COMPONENT, ApplicationRef])
    })),
    CONST_EXPR(new Provider(ROUTER_PRIMARY_COMPONENT, { useFactory: routerPrimaryComponentFactory, deps: CONST_EXPR([ApplicationRef]) }))
]);
/**
 * Use {@link ROUTER_PROVIDERS} instead.
 *
 * @deprecated
 */
export const ROUTER_BINDINGS = ROUTER_PROVIDERS;
function routerFactory(registry, location, primaryComponent, appRef) {
    var rootRouter = new RootRouter(registry, location, primaryComponent);
    appRef.registerDisposeListener(() => rootRouter.dispose());
    return rootRouter;
}
function routerPrimaryComponentFactory(app) {
    if (app.componentTypes.length == 0) {
        throw new BaseException("Bootstrap at least one component before injecting Router.");
    }
    return app.componentTypes[0];
}

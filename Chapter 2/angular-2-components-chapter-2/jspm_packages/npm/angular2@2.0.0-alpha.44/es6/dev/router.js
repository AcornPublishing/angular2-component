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
export { RouteParams } from './src/router/instruction';
export { RouteRegistry } from './src/router/route_registry';
export { LocationStrategy } from './src/router/location_strategy';
export { HashLocationStrategy } from './src/router/hash_location_strategy';
export { PathLocationStrategy } from './src/router/path_location_strategy';
export { Location, APP_BASE_HREF } from './src/router/location';
export * from './src/router/route_config_decorator';
export * from './src/router/route_definition';
export { CanActivate } from './src/router/lifecycle_annotations';
export { Instruction, ComponentInstruction } from './src/router/instruction';
export { OpaqueToken } from 'angular2/angular2';
export { ROUTE_DATA } from './src/router/route_data';
import { LocationStrategy } from './src/router/location_strategy';
import { PathLocationStrategy } from './src/router/path_location_strategy';
import { Router, RootRouter } from './src/router/router';
import { RouterOutlet } from './src/router/router_outlet';
import { RouterLink } from './src/router/router_link';
import { RouteRegistry } from './src/router/route_registry';
import { Location } from './src/router/location';
import { ApplicationRef, OpaqueToken, Provider } from 'angular2/angular2';
import { CONST_EXPR } from './src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
/**
 * Token used to bind the component with the top-level {@link RouteConfig}s for the
 * application.
 *
 * ## Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
 *
 * ```
 * import {Component} from 'angular2/angular2';
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
export const ROUTER_PRIMARY_COMPONENT = CONST_EXPR(new OpaqueToken('RouterPrimaryComponent'));
/**
 * A list of directives. To use the router directives like {@link RouterOutlet} and
 * {@link RouterLink}, add this to your `directives` array in the {@link View} decorator of your
 * component.
 *
 * ## Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
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
 * ## Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
 *
 * ```
 * import {Component} from 'angular2/angular2';
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
    Location,
    CONST_EXPR(new Provider(Router, {
        useFactory: routerFactory,
        deps: CONST_EXPR([RouteRegistry, Location, ROUTER_PRIMARY_COMPONENT])
    })),
    CONST_EXPR(new Provider(ROUTER_PRIMARY_COMPONENT, { useFactory: routerPrimaryComponentFactory, deps: CONST_EXPR([ApplicationRef]) }))
]);
/**
 * @deprecated
 */
export const ROUTER_BINDINGS = ROUTER_PROVIDERS;
function routerFactory(registry, location, primaryComponent) {
    return new RootRouter(registry, location, primaryComponent);
}
function routerPrimaryComponentFactory(app) {
    if (app.componentTypes.length == 0) {
        throw new BaseException("Bootstrap at least one component before injecting Router.");
    }
    return app.componentTypes[0];
}
//# sourceMappingURL=router.js.map
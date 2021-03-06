/* */ 
"format cjs";
export { AngularEntrypoint } from 'angular2/src/core/angular_entrypoint';
export { BROWSER_PROVIDERS, ELEMENT_PROBE_BINDINGS, ELEMENT_PROBE_PROVIDERS, inspectNativeElement, BrowserDomAdapter, By, Title, DOCUMENT, enableDebugTools, disableDebugTools } from 'angular2/src/platform/browser_common';
import { isPresent, CONST_EXPR } from 'angular2/src/facade/lang';
import { BROWSER_PROVIDERS, BROWSER_APP_COMMON_PROVIDERS } from 'angular2/src/platform/browser_common';
import { COMPILER_PROVIDERS } from 'angular2/compiler';
import { platform, reflector } from 'angular2/core';
import { ReflectionCapabilities } from 'angular2/src/core/reflection/reflection_capabilities';
import { XHRImpl } from "angular2/src/platform/browser/xhr_impl";
import { XHR } from 'angular2/compiler';
import { Provider } from 'angular2/src/core/di';
/**
 * An array of providers that should be passed into `application()` when bootstrapping a component.
 */
export const BROWSER_APP_PROVIDERS = CONST_EXPR([
    BROWSER_APP_COMMON_PROVIDERS,
    COMPILER_PROVIDERS,
    new Provider(XHR, { useClass: XHRImpl }),
]);
/**
 * Bootstrapping for Angular applications.
 *
 * You instantiate an Angular application by explicitly specifying a component to use
 * as the root component for your application via the `bootstrap()` method.
 *
 * ## Simple Example
 *
 * Assuming this `index.html`:
 *
 * ```html
 * <html>
 *   <!-- load Angular script tags here. -->
 *   <body>
 *     <my-app>loading...</my-app>
 *   </body>
 * </html>
 * ```
 *
 * An application is bootstrapped inside an existing browser DOM, typically `index.html`.
 * Unlike Angular 1, Angular 2 does not compile/process providers in `index.html`. This is
 * mainly for security reasons, as well as architectural changes in Angular 2. This means
 * that `index.html` can safely be processed using server-side technologies such as
 * providers. Bindings can thus use double-curly `{{ syntax }}` without collision from
 * Angular 2 component double-curly `{{ syntax }}`.
 *
 * We can use this script code:
 *
 * {@example core/ts/bootstrap/bootstrap.ts region='bootstrap'}
 *
 * When the app developer invokes `bootstrap()` with the root component `MyApp` as its
 * argument, Angular performs the following tasks:
 *
 *  1. It uses the component's `selector` property to locate the DOM element which needs
 *     to be upgraded into the angular component.
 *  2. It creates a new child injector (from the platform injector). Optionally, you can
 *     also override the injector configuration for an app by invoking `bootstrap` with the
 *     `componentInjectableBindings` argument.
 *  3. It creates a new `Zone` and connects it to the angular application's change detection
 *     domain instance.
 *  4. It creates an emulated or shadow DOM on the selected component's host element and loads the
 *     template into it.
 *  5. It instantiates the specified component.
 *  6. Finally, Angular performs change detection to apply the initial data providers for the
 *     application.
 *
 *
 * ## Bootstrapping Multiple Applications
 *
 * When working within a browser window, there are many singleton resources: cookies, title,
 * location, and others. Angular services that represent these resources must likewise be
 * shared across all Angular applications that occupy the same browser window. For this
 * reason, Angular creates exactly one global platform object which stores all shared
 * services, and each angular application injector has the platform injector as its parent.
 *
 * Each application has its own private injector as well. When there are multiple
 * applications on a page, Angular treats each application injector's services as private
 * to that application.
 *
 * ## API
 *
 * - `appComponentType`: The root component which should act as the application. This is
 *   a reference to a `Type` which is annotated with `@Component(...)`.
 * - `customProviders`: An additional set of providers that can be added to the
 *   app injector to override default injection behavior.
 *
 * Returns a `Promise` of {@link ComponentRef}.
 */
export function bootstrap(appComponentType, customProviders) {
    reflector.reflectionCapabilities = new ReflectionCapabilities();
    let appProviders = isPresent(customProviders) ? [BROWSER_APP_PROVIDERS, customProviders] : BROWSER_APP_PROVIDERS;
    return platform(BROWSER_PROVIDERS).application(appProviders).bootstrap(appComponentType);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXIudHMiXSwibmFtZXMiOlsiYm9vdHN0cmFwIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFRLGlCQUFpQixRQUFPLHNDQUFzQyxDQUFDO0FBQ3ZFLFNBQ0UsaUJBQWlCLEVBQ2pCLHNCQUFzQixFQUN0Qix1QkFBdUIsRUFDdkIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQixFQUFFLEVBQ0YsS0FBSyxFQUNMLFFBQVEsRUFDUixnQkFBZ0IsRUFDaEIsaUJBQWlCLFFBQ1osc0NBQXNDLENBQUM7T0FFdkMsRUFBTyxTQUFTLEVBQUUsVUFBVSxFQUFDLE1BQU0sMEJBQTBCO09BRTdELEVBQ0wsaUJBQWlCLEVBQ2pCLDRCQUE0QixFQUM3QixNQUFNLHNDQUFzQztPQUN0QyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sbUJBQW1CO09BQzdDLEVBQWUsUUFBUSxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWU7T0FDeEQsRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHNEQUFzRDtPQUNwRixFQUFDLE9BQU8sRUFBQyxNQUFNLHdDQUF3QztPQUN2RCxFQUFDLEdBQUcsRUFBQyxNQUFNLG1CQUFtQjtPQUM5QixFQUFDLFFBQVEsRUFBQyxNQUFNLHNCQUFzQjtBQUU3Qzs7R0FFRztBQUNILGFBQWEscUJBQXFCLEdBQTJDLFVBQVUsQ0FBQztJQUN0Riw0QkFBNEI7SUFDNUIsa0JBQWtCO0lBQ2xCLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztDQUN2QyxDQUFDLENBQUM7QUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1FRztBQUNILDBCQUNJLGdCQUFzQixFQUN0QixlQUF3RDtJQUMxREEsU0FBU0EsQ0FBQ0Esc0JBQXNCQSxHQUFHQSxJQUFJQSxzQkFBc0JBLEVBQUVBLENBQUNBO0lBQ2hFQSxJQUFJQSxZQUFZQSxHQUNaQSxTQUFTQSxDQUFDQSxlQUFlQSxDQUFDQSxHQUFHQSxDQUFDQSxxQkFBcUJBLEVBQUVBLGVBQWVBLENBQUNBLEdBQUdBLHFCQUFxQkEsQ0FBQ0E7SUFDbEdBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQTtBQUMzRkEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQge0FuZ3VsYXJFbnRyeXBvaW50fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9hbmd1bGFyX2VudHJ5cG9pbnQnO1xuZXhwb3J0IHtcbiAgQlJPV1NFUl9QUk9WSURFUlMsXG4gIEVMRU1FTlRfUFJPQkVfQklORElOR1MsXG4gIEVMRU1FTlRfUFJPQkVfUFJPVklERVJTLFxuICBpbnNwZWN0TmF0aXZlRWxlbWVudCxcbiAgQnJvd3NlckRvbUFkYXB0ZXIsXG4gIEJ5LFxuICBUaXRsZSxcbiAgRE9DVU1FTlQsXG4gIGVuYWJsZURlYnVnVG9vbHMsXG4gIGRpc2FibGVEZWJ1Z1Rvb2xzXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyX2NvbW1vbic7XG5cbmltcG9ydCB7VHlwZSwgaXNQcmVzZW50LCBDT05TVF9FWFBSfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtQcm9taXNlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL3Byb21pc2UnO1xuaW1wb3J0IHtcbiAgQlJPV1NFUl9QUk9WSURFUlMsXG4gIEJST1dTRVJfQVBQX0NPTU1PTl9QUk9WSURFUlNcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXJfY29tbW9uJztcbmltcG9ydCB7Q09NUElMRVJfUFJPVklERVJTfSBmcm9tICdhbmd1bGFyMi9jb21waWxlcic7XG5pbXBvcnQge0NvbXBvbmVudFJlZiwgcGxhdGZvcm0sIHJlZmxlY3Rvcn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1JlZmxlY3Rpb25DYXBhYmlsaXRpZXN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbl9jYXBhYmlsaXRpZXMnO1xuaW1wb3J0IHtYSFJJbXBsfSBmcm9tIFwiYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIveGhyX2ltcGxcIjtcbmltcG9ydCB7WEhSfSBmcm9tICdhbmd1bGFyMi9jb21waWxlcic7XG5pbXBvcnQge1Byb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5cbi8qKlxuICogQW4gYXJyYXkgb2YgcHJvdmlkZXJzIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCBpbnRvIGBhcHBsaWNhdGlvbigpYCB3aGVuIGJvb3RzdHJhcHBpbmcgYSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBjb25zdCBCUk9XU0VSX0FQUF9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID0gQ09OU1RfRVhQUihbXG4gIEJST1dTRVJfQVBQX0NPTU1PTl9QUk9WSURFUlMsXG4gIENPTVBJTEVSX1BST1ZJREVSUyxcbiAgbmV3IFByb3ZpZGVyKFhIUiwge3VzZUNsYXNzOiBYSFJJbXBsfSksXG5dKTtcblxuLyoqXG4gKiBCb290c3RyYXBwaW5nIGZvciBBbmd1bGFyIGFwcGxpY2F0aW9ucy5cbiAqXG4gKiBZb3UgaW5zdGFudGlhdGUgYW4gQW5ndWxhciBhcHBsaWNhdGlvbiBieSBleHBsaWNpdGx5IHNwZWNpZnlpbmcgYSBjb21wb25lbnQgdG8gdXNlXG4gKiBhcyB0aGUgcm9vdCBjb21wb25lbnQgZm9yIHlvdXIgYXBwbGljYXRpb24gdmlhIHRoZSBgYm9vdHN0cmFwKClgIG1ldGhvZC5cbiAqXG4gKiAjIyBTaW1wbGUgRXhhbXBsZVxuICpcbiAqIEFzc3VtaW5nIHRoaXMgYGluZGV4Lmh0bWxgOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxodG1sPlxuICogICA8IS0tIGxvYWQgQW5ndWxhciBzY3JpcHQgdGFncyBoZXJlLiAtLT5cbiAqICAgPGJvZHk+XG4gKiAgICAgPG15LWFwcD5sb2FkaW5nLi4uPC9teS1hcHA+XG4gKiAgIDwvYm9keT5cbiAqIDwvaHRtbD5cbiAqIGBgYFxuICpcbiAqIEFuIGFwcGxpY2F0aW9uIGlzIGJvb3RzdHJhcHBlZCBpbnNpZGUgYW4gZXhpc3RpbmcgYnJvd3NlciBET00sIHR5cGljYWxseSBgaW5kZXguaHRtbGAuXG4gKiBVbmxpa2UgQW5ndWxhciAxLCBBbmd1bGFyIDIgZG9lcyBub3QgY29tcGlsZS9wcm9jZXNzIHByb3ZpZGVycyBpbiBgaW5kZXguaHRtbGAuIFRoaXMgaXNcbiAqIG1haW5seSBmb3Igc2VjdXJpdHkgcmVhc29ucywgYXMgd2VsbCBhcyBhcmNoaXRlY3R1cmFsIGNoYW5nZXMgaW4gQW5ndWxhciAyLiBUaGlzIG1lYW5zXG4gKiB0aGF0IGBpbmRleC5odG1sYCBjYW4gc2FmZWx5IGJlIHByb2Nlc3NlZCB1c2luZyBzZXJ2ZXItc2lkZSB0ZWNobm9sb2dpZXMgc3VjaCBhc1xuICogcHJvdmlkZXJzLiBCaW5kaW5ncyBjYW4gdGh1cyB1c2UgZG91YmxlLWN1cmx5IGB7eyBzeW50YXggfX1gIHdpdGhvdXQgY29sbGlzaW9uIGZyb21cbiAqIEFuZ3VsYXIgMiBjb21wb25lbnQgZG91YmxlLWN1cmx5IGB7eyBzeW50YXggfX1gLlxuICpcbiAqIFdlIGNhbiB1c2UgdGhpcyBzY3JpcHQgY29kZTpcbiAqXG4gKiB7QGV4YW1wbGUgY29yZS90cy9ib290c3RyYXAvYm9vdHN0cmFwLnRzIHJlZ2lvbj0nYm9vdHN0cmFwJ31cbiAqXG4gKiBXaGVuIHRoZSBhcHAgZGV2ZWxvcGVyIGludm9rZXMgYGJvb3RzdHJhcCgpYCB3aXRoIHRoZSByb290IGNvbXBvbmVudCBgTXlBcHBgIGFzIGl0c1xuICogYXJndW1lbnQsIEFuZ3VsYXIgcGVyZm9ybXMgdGhlIGZvbGxvd2luZyB0YXNrczpcbiAqXG4gKiAgMS4gSXQgdXNlcyB0aGUgY29tcG9uZW50J3MgYHNlbGVjdG9yYCBwcm9wZXJ0eSB0byBsb2NhdGUgdGhlIERPTSBlbGVtZW50IHdoaWNoIG5lZWRzXG4gKiAgICAgdG8gYmUgdXBncmFkZWQgaW50byB0aGUgYW5ndWxhciBjb21wb25lbnQuXG4gKiAgMi4gSXQgY3JlYXRlcyBhIG5ldyBjaGlsZCBpbmplY3RvciAoZnJvbSB0aGUgcGxhdGZvcm0gaW5qZWN0b3IpLiBPcHRpb25hbGx5LCB5b3UgY2FuXG4gKiAgICAgYWxzbyBvdmVycmlkZSB0aGUgaW5qZWN0b3IgY29uZmlndXJhdGlvbiBmb3IgYW4gYXBwIGJ5IGludm9raW5nIGBib290c3RyYXBgIHdpdGggdGhlXG4gKiAgICAgYGNvbXBvbmVudEluamVjdGFibGVCaW5kaW5nc2AgYXJndW1lbnQuXG4gKiAgMy4gSXQgY3JlYXRlcyBhIG5ldyBgWm9uZWAgYW5kIGNvbm5lY3RzIGl0IHRvIHRoZSBhbmd1bGFyIGFwcGxpY2F0aW9uJ3MgY2hhbmdlIGRldGVjdGlvblxuICogICAgIGRvbWFpbiBpbnN0YW5jZS5cbiAqICA0LiBJdCBjcmVhdGVzIGFuIGVtdWxhdGVkIG9yIHNoYWRvdyBET00gb24gdGhlIHNlbGVjdGVkIGNvbXBvbmVudCdzIGhvc3QgZWxlbWVudCBhbmQgbG9hZHMgdGhlXG4gKiAgICAgdGVtcGxhdGUgaW50byBpdC5cbiAqICA1LiBJdCBpbnN0YW50aWF0ZXMgdGhlIHNwZWNpZmllZCBjb21wb25lbnQuXG4gKiAgNi4gRmluYWxseSwgQW5ndWxhciBwZXJmb3JtcyBjaGFuZ2UgZGV0ZWN0aW9uIHRvIGFwcGx5IHRoZSBpbml0aWFsIGRhdGEgcHJvdmlkZXJzIGZvciB0aGVcbiAqICAgICBhcHBsaWNhdGlvbi5cbiAqXG4gKlxuICogIyMgQm9vdHN0cmFwcGluZyBNdWx0aXBsZSBBcHBsaWNhdGlvbnNcbiAqXG4gKiBXaGVuIHdvcmtpbmcgd2l0aGluIGEgYnJvd3NlciB3aW5kb3csIHRoZXJlIGFyZSBtYW55IHNpbmdsZXRvbiByZXNvdXJjZXM6IGNvb2tpZXMsIHRpdGxlLFxuICogbG9jYXRpb24sIGFuZCBvdGhlcnMuIEFuZ3VsYXIgc2VydmljZXMgdGhhdCByZXByZXNlbnQgdGhlc2UgcmVzb3VyY2VzIG11c3QgbGlrZXdpc2UgYmVcbiAqIHNoYXJlZCBhY3Jvc3MgYWxsIEFuZ3VsYXIgYXBwbGljYXRpb25zIHRoYXQgb2NjdXB5IHRoZSBzYW1lIGJyb3dzZXIgd2luZG93LiBGb3IgdGhpc1xuICogcmVhc29uLCBBbmd1bGFyIGNyZWF0ZXMgZXhhY3RseSBvbmUgZ2xvYmFsIHBsYXRmb3JtIG9iamVjdCB3aGljaCBzdG9yZXMgYWxsIHNoYXJlZFxuICogc2VydmljZXMsIGFuZCBlYWNoIGFuZ3VsYXIgYXBwbGljYXRpb24gaW5qZWN0b3IgaGFzIHRoZSBwbGF0Zm9ybSBpbmplY3RvciBhcyBpdHMgcGFyZW50LlxuICpcbiAqIEVhY2ggYXBwbGljYXRpb24gaGFzIGl0cyBvd24gcHJpdmF0ZSBpbmplY3RvciBhcyB3ZWxsLiBXaGVuIHRoZXJlIGFyZSBtdWx0aXBsZVxuICogYXBwbGljYXRpb25zIG9uIGEgcGFnZSwgQW5ndWxhciB0cmVhdHMgZWFjaCBhcHBsaWNhdGlvbiBpbmplY3RvcidzIHNlcnZpY2VzIGFzIHByaXZhdGVcbiAqIHRvIHRoYXQgYXBwbGljYXRpb24uXG4gKlxuICogIyMgQVBJXG4gKlxuICogLSBgYXBwQ29tcG9uZW50VHlwZWA6IFRoZSByb290IGNvbXBvbmVudCB3aGljaCBzaG91bGQgYWN0IGFzIHRoZSBhcHBsaWNhdGlvbi4gVGhpcyBpc1xuICogICBhIHJlZmVyZW5jZSB0byBhIGBUeXBlYCB3aGljaCBpcyBhbm5vdGF0ZWQgd2l0aCBgQENvbXBvbmVudCguLi4pYC5cbiAqIC0gYGN1c3RvbVByb3ZpZGVyc2A6IEFuIGFkZGl0aW9uYWwgc2V0IG9mIHByb3ZpZGVycyB0aGF0IGNhbiBiZSBhZGRlZCB0byB0aGVcbiAqICAgYXBwIGluamVjdG9yIHRvIG92ZXJyaWRlIGRlZmF1bHQgaW5qZWN0aW9uIGJlaGF2aW9yLlxuICpcbiAqIFJldHVybnMgYSBgUHJvbWlzZWAgb2Yge0BsaW5rIENvbXBvbmVudFJlZn0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBib290c3RyYXAoXG4gICAgYXBwQ29tcG9uZW50VHlwZTogVHlwZSxcbiAgICBjdXN0b21Qcm92aWRlcnM/OiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPik6IFByb21pc2U8Q29tcG9uZW50UmVmPiB7XG4gIHJlZmxlY3Rvci5yZWZsZWN0aW9uQ2FwYWJpbGl0aWVzID0gbmV3IFJlZmxlY3Rpb25DYXBhYmlsaXRpZXMoKTtcbiAgbGV0IGFwcFByb3ZpZGVycyA9XG4gICAgICBpc1ByZXNlbnQoY3VzdG9tUHJvdmlkZXJzKSA/IFtCUk9XU0VSX0FQUF9QUk9WSURFUlMsIGN1c3RvbVByb3ZpZGVyc10gOiBCUk9XU0VSX0FQUF9QUk9WSURFUlM7XG4gIHJldHVybiBwbGF0Zm9ybShCUk9XU0VSX1BST1ZJREVSUykuYXBwbGljYXRpb24oYXBwUHJvdmlkZXJzKS5ib290c3RyYXAoYXBwQ29tcG9uZW50VHlwZSk7XG59XG4iXX0=
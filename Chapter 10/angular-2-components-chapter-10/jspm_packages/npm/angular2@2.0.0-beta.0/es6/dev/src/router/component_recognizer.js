/* */ 
"format cjs";
import { isBlank, isPresent } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { Map } from 'angular2/src/facade/collection';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { RouteRecognizer, RedirectRecognizer } from './route_recognizer';
import { Route, AsyncRoute, AuxRoute, Redirect } from './route_config_impl';
import { AsyncRouteHandler } from './async_route_handler';
import { SyncRouteHandler } from './sync_route_handler';
/**
 * `ComponentRecognizer` is responsible for recognizing routes for a single component.
 * It is consumed by `RouteRegistry`, which knows how to recognize an entire hierarchy of
 * components.
 */
export class ComponentRecognizer {
    constructor() {
        this.names = new Map();
        // map from name to recognizer
        this.auxNames = new Map();
        // map from starting path to recognizer
        this.auxRoutes = new Map();
        // TODO: optimize this into a trie
        this.matchers = [];
        this.defaultRoute = null;
    }
    /**
     * returns whether or not the config is terminal
     */
    config(config) {
        var handler;
        if (isPresent(config.name) && config.name[0].toUpperCase() != config.name[0]) {
            var suggestedName = config.name[0].toUpperCase() + config.name.substring(1);
            throw new BaseException(`Route "${config.path}" with name "${config.name}" does not begin with an uppercase letter. Route names should be CamelCase like "${suggestedName}".`);
        }
        if (config instanceof AuxRoute) {
            handler = new SyncRouteHandler(config.component, config.data);
            let path = config.path.startsWith('/') ? config.path.substring(1) : config.path;
            var recognizer = new RouteRecognizer(config.path, handler);
            this.auxRoutes.set(path, recognizer);
            if (isPresent(config.name)) {
                this.auxNames.set(config.name, recognizer);
            }
            return recognizer.terminal;
        }
        var useAsDefault = false;
        if (config instanceof Redirect) {
            let redirector = new RedirectRecognizer(config.path, config.redirectTo);
            this._assertNoHashCollision(redirector.hash, config.path);
            this.matchers.push(redirector);
            return true;
        }
        if (config instanceof Route) {
            handler = new SyncRouteHandler(config.component, config.data);
            useAsDefault = isPresent(config.useAsDefault) && config.useAsDefault;
        }
        else if (config instanceof AsyncRoute) {
            handler = new AsyncRouteHandler(config.loader, config.data);
            useAsDefault = isPresent(config.useAsDefault) && config.useAsDefault;
        }
        var recognizer = new RouteRecognizer(config.path, handler);
        this._assertNoHashCollision(recognizer.hash, config.path);
        if (useAsDefault) {
            if (isPresent(this.defaultRoute)) {
                throw new BaseException(`Only one route can be default`);
            }
            this.defaultRoute = recognizer;
        }
        this.matchers.push(recognizer);
        if (isPresent(config.name)) {
            this.names.set(config.name, recognizer);
        }
        return recognizer.terminal;
    }
    _assertNoHashCollision(hash, path) {
        this.matchers.forEach((matcher) => {
            if (hash == matcher.hash) {
                throw new BaseException(`Configuration '${path}' conflicts with existing route '${matcher.path}'`);
            }
        });
    }
    /**
     * Given a URL, returns a list of `RouteMatch`es, which are partial recognitions for some route.
     */
    recognize(urlParse) {
        var solutions = [];
        this.matchers.forEach((routeRecognizer) => {
            var pathMatch = routeRecognizer.recognize(urlParse);
            if (isPresent(pathMatch)) {
                solutions.push(pathMatch);
            }
        });
        return solutions;
    }
    recognizeAuxiliary(urlParse) {
        var routeRecognizer = this.auxRoutes.get(urlParse.path);
        if (isPresent(routeRecognizer)) {
            return [routeRecognizer.recognize(urlParse)];
        }
        return [PromiseWrapper.resolve(null)];
    }
    hasRoute(name) { return this.names.has(name); }
    componentLoaded(name) {
        return this.hasRoute(name) && isPresent(this.names.get(name).handler.componentType);
    }
    loadComponent(name) {
        return this.names.get(name).handler.resolveComponentType();
    }
    generate(name, params) {
        var pathRecognizer = this.names.get(name);
        if (isBlank(pathRecognizer)) {
            return null;
        }
        return pathRecognizer.generate(params);
    }
    generateAuxiliary(name, params) {
        var pathRecognizer = this.auxNames.get(name);
        if (isBlank(pathRecognizer)) {
            return null;
        }
        return pathRecognizer.generate(params);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X3JlY29nbml6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvcm91dGVyL2NvbXBvbmVudF9yZWNvZ25pemVyLnRzIl0sIm5hbWVzIjpbIkNvbXBvbmVudFJlY29nbml6ZXIiLCJDb21wb25lbnRSZWNvZ25pemVyLmNvbnN0cnVjdG9yIiwiQ29tcG9uZW50UmVjb2duaXplci5jb25maWciLCJDb21wb25lbnRSZWNvZ25pemVyLl9hc3NlcnROb0hhc2hDb2xsaXNpb24iLCJDb21wb25lbnRSZWNvZ25pemVyLnJlY29nbml6ZSIsIkNvbXBvbmVudFJlY29nbml6ZXIucmVjb2duaXplQXV4aWxpYXJ5IiwiQ29tcG9uZW50UmVjb2duaXplci5oYXNSb3V0ZSIsIkNvbXBvbmVudFJlY29nbml6ZXIuY29tcG9uZW50TG9hZGVkIiwiQ29tcG9uZW50UmVjb2duaXplci5sb2FkQ29tcG9uZW50IiwiQ29tcG9uZW50UmVjb2duaXplci5nZW5lcmF0ZSIsIkNvbXBvbmVudFJlY29nbml6ZXIuZ2VuZXJhdGVBdXhpbGlhcnkiXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBQyxNQUFNLDBCQUEwQjtPQUNwRCxFQUFDLGFBQWEsRUFBbUIsTUFBTSxnQ0FBZ0M7T0FDdkUsRUFBQyxHQUFHLEVBQTRDLE1BQU0sZ0NBQWdDO09BQ3RGLEVBQVUsY0FBYyxFQUFDLE1BQU0sMkJBQTJCO09BRTFELEVBRUwsZUFBZSxFQUNmLGtCQUFrQixFQUVuQixNQUFNLG9CQUFvQjtPQUNwQixFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBa0IsTUFBTSxxQkFBcUI7T0FDbkYsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QjtPQUNoRCxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCO0FBS3JEOzs7O0dBSUc7QUFDSDtJQUFBQTtRQUNFQyxVQUFLQSxHQUFHQSxJQUFJQSxHQUFHQSxFQUEyQkEsQ0FBQ0E7UUFFM0NBLDhCQUE4QkE7UUFDOUJBLGFBQVFBLEdBQUdBLElBQUlBLEdBQUdBLEVBQTJCQSxDQUFDQTtRQUU5Q0EsdUNBQXVDQTtRQUN2Q0EsY0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsRUFBMkJBLENBQUNBO1FBRS9DQSxrQ0FBa0NBO1FBQ2xDQSxhQUFRQSxHQUF5QkEsRUFBRUEsQ0FBQ0E7UUFFcENBLGlCQUFZQSxHQUFvQkEsSUFBSUEsQ0FBQ0E7SUF5SHZDQSxDQUFDQTtJQXZIQ0Q7O09BRUdBO0lBQ0hBLE1BQU1BLENBQUNBLE1BQXVCQTtRQUM1QkUsSUFBSUEsT0FBT0EsQ0FBQ0E7UUFFWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0VBLElBQUlBLGFBQWFBLEdBQUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLEVBQUVBLEdBQUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzVFQSxNQUFNQSxJQUFJQSxhQUFhQSxDQUNuQkEsVUFBVUEsTUFBTUEsQ0FBQ0EsSUFBSUEsZ0JBQWdCQSxNQUFNQSxDQUFDQSxJQUFJQSxvRkFBb0ZBLGFBQWFBLElBQUlBLENBQUNBLENBQUNBO1FBQzdKQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxZQUFZQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvQkEsT0FBT0EsR0FBR0EsSUFBSUEsZ0JBQWdCQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxFQUFFQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUM5REEsSUFBSUEsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDaEZBLElBQUlBLFVBQVVBLEdBQUdBLElBQUlBLGVBQWVBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBO1lBQzNEQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUNyQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUM3Q0EsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDN0JBLENBQUNBO1FBRURBLElBQUlBLFlBQVlBLEdBQUdBLEtBQUtBLENBQUNBO1FBRXpCQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxZQUFZQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvQkEsSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsa0JBQWtCQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxFQUFFQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUN4RUEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxFQUFFQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUMxREEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLE1BQU1BLENBQUNBLElB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Q0EsT0FBT0EsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxDQUFDQTtJQUM3REEsQ0FBQ0E7SUFFRFIsUUFBUUEsQ0FBQ0EsSUFBWUEsRUFBRUEsTUFBV0E7UUFDaENTLElBQUlBLGNBQWNBLEdBQW9CQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMzREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDNUJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2RBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQ3pDQSxDQUFDQTtJQUVEVCxpQkFBaUJBLENBQUNBLElBQVlBLEVBQUVBLE1BQVdBO1FBQ3pDVSxJQUFJQSxjQUFjQSxHQUFvQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDOURBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzVCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNkQSxDQUFDQTtRQUNEQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7QUFDSFYsQ0FBQ0E7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNCbGFuaywgaXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtNYXAsIE1hcFdyYXBwZXIsIExpc3RXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtQcm9taXNlLCBQcm9taXNlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5cbmltcG9ydCB7XG4gIEFic3RyYWN0UmVjb2duaXplcixcbiAgUm91dGVSZWNvZ25pemVyLFxuICBSZWRpcmVjdFJlY29nbml6ZXIsXG4gIFJvdXRlTWF0Y2hcbn0gZnJvbSAnLi9yb3V0ZV9yZWNvZ25pemVyJztcbmltcG9ydCB7Um91dGUsIEFzeW5jUm91dGUsIEF1eFJvdXRlLCBSZWRpcmVjdCwgUm91dGVEZWZpbml0aW9ufSBmcm9tICcuL3JvdXRlX2NvbmZpZ19pbXBsJztcbmltcG9ydCB7QXN5bmNSb3V0ZUhhbmRsZXJ9IGZyb20gJy4vYXN5bmNfcm91dGVfaGFuZGxlcic7XG5pbXBvcnQge1N5bmNSb3V0ZUhhbmRsZXJ9IGZyb20gJy4vc3luY19yb3V0ZV9oYW5kbGVyJztcbmltcG9ydCB7VXJsfSBmcm9tICcuL3VybF9wYXJzZXInO1xuaW1wb3J0IHtDb21wb25lbnRJbnN0cnVjdGlvbn0gZnJvbSAnLi9pbnN0cnVjdGlvbic7XG5cblxuLyoqXG4gKiBgQ29tcG9uZW50UmVjb2duaXplcmAgaXMgcmVzcG9uc2libGUgZm9yIHJlY29nbml6aW5nIHJvdXRlcyBmb3IgYSBzaW5nbGUgY29tcG9uZW50LlxuICogSXQgaXMgY29uc3VtZWQgYnkgYFJvdXRlUmVnaXN0cnlgLCB3aGljaCBrbm93cyBob3cgdG8gcmVjb2duaXplIGFuIGVudGlyZSBoaWVyYXJjaHkgb2ZcbiAqIGNvbXBvbmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRSZWNvZ25pemVyIHtcbiAgbmFtZXMgPSBuZXcgTWFwPHN0cmluZywgUm91dGVSZWNvZ25pemVyPigpO1xuXG4gIC8vIG1hcCBmcm9tIG5hbWUgdG8gcmVjb2duaXplclxuICBhdXhOYW1lcyA9IG5ldyBNYXA8c3RyaW5nLCBSb3V0ZVJlY29nbml6ZXI+KCk7XG5cbiAgLy8gbWFwIGZyb20gc3RhcnRpbmcgcGF0aCB0byByZWNvZ25pemVyXG4gIGF1eFJvdXRlcyA9IG5ldyBNYXA8c3RyaW5nLCBSb3V0ZVJlY29nbml6ZXI+KCk7XG5cbiAgLy8gVE9ETzogb3B0aW1pemUgdGhpcyBpbnRvIGEgdHJpZVxuICBtYXRjaGVyczogQWJzdHJhY3RSZWNvZ25pemVyW10gPSBbXTtcblxuICBkZWZhdWx0Um91dGU6IFJvdXRlUmVjb2duaXplciA9IG51bGw7XG5cbiAgLyoqXG4gICAqIHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGNvbmZpZyBpcyB0ZXJtaW5hbFxuICAgKi9cbiAgY29uZmlnKGNvbmZpZzogUm91dGVEZWZpbml0aW9uKTogYm9vbGVhbiB7XG4gICAgdmFyIGhhbmRsZXI7XG5cbiAgICBpZiAoaXNQcmVzZW50KGNvbmZpZy5uYW1lKSAmJiBjb25maWcubmFtZVswXS50b1VwcGVyQ2FzZSgpICE9IGNvbmZpZy5uYW1lWzBdKSB7XG4gICAgICB2YXIgc3VnZ2VzdGVkTmFtZSA9IGNvbmZpZy5uYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBjb25maWcubmFtZS5zdWJzdHJpbmcoMSk7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICBgUm91dGUgXCIke2NvbmZpZy5wYXRofVwiIHdpdGggbmFtZSBcIiR7Y29uZmlnLm5hbWV9XCIgZG9lcyBub3QgYmVnaW4gd2l0aCBhbiB1cHBlcmNhc2UgbGV0dGVyLiBSb3V0ZSBuYW1lcyBzaG91bGQgYmUgQ2FtZWxDYXNlIGxpa2UgXCIke3N1Z2dlc3RlZE5hbWV9XCIuYCk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZyBpbnN0YW5jZW9mIEF1eFJvdXRlKSB7XG4gICAgICBoYW5kbGVyID0gbmV3IFN5bmNSb3V0ZUhhbmRsZXIoY29uZmlnLmNvbXBvbmVudCwgY29uZmlnLmRhdGEpO1xuICAgICAgbGV0IHBhdGggPSBjb25maWcucGF0aC5zdGFydHNXaXRoKCcvJykgPyBjb25maWcucGF0aC5zdWJzdHJpbmcoMSkgOiBjb25maWcucGF0aDtcbiAgICAgIHZhciByZWNvZ25pemVyID0gbmV3IFJvdXRlUmVjb2duaXplcihjb25maWcucGF0aCwgaGFuZGxlcik7XG4gICAgICB0aGlzLmF1eFJvdXRlcy5zZXQocGF0aCwgcmVjb2duaXplcik7XG4gICAgICBpZiAoaXNQcmVzZW50KGNvbmZpZy5uYW1lKSkge1xuICAgICAgICB0aGlzLmF1eE5hbWVzLnNldChjb25maWcubmFtZSwgcmVjb2duaXplcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVjb2duaXplci50ZXJtaW5hbDtcbiAgICB9XG5cbiAgICB2YXIgdXNlQXNEZWZhdWx0ID0gZmFsc2U7XG5cbiAgICBpZiAoY29uZmlnIGluc3RhbmNlb2YgUmVkaXJlY3QpIHtcbiAgICAgIGxldCByZWRpcmVjdG9yID0gbmV3IFJlZGlyZWN0UmVjb2duaXplcihjb25maWcucGF0aCwgY29uZmlnLnJlZGlyZWN0VG8pO1xuICAgICAgdGhpcy5fYXNzZXJ0Tm9IYXNoQ29sbGlzaW9uKHJlZGlyZWN0b3IuaGFzaCwgY29uZmlnLnBhdGgpO1xuICAgICAgdGhpcy5tYXRjaGVycy5wdXNoKHJlZGlyZWN0b3IpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZyBpbnN0YW5jZW9mIFJvdXRlKSB7XG4gICAgICBoYW5kbGVyID0gbmV3IFN5bmNSb3V0ZUhhbmRsZXIoY29uZmlnLmNvbXBvbmVudCwgY29uZmlnLmRhdGEpO1xuICAgICAgdXNlQXNEZWZhdWx0ID0gaXNQcmVzZW50KGNvbmZpZy51c2VBc0RlZmF1bHQpICYmIGNvbmZpZy51c2VBc0RlZmF1bHQ7XG4gICAgfSBlbHNlIGlmIChjb25maWcgaW5zdGFuY2VvZiBBc3luY1JvdXRlKSB7XG4gICAgICBoYW5kbGVyID0gbmV3IEFzeW5jUm91dGVIYW5kbGVyKGNvbmZpZy5sb2FkZXIsIGNvbmZpZy5kYXRhKTtcbiAgICAgIHVzZUFzRGVmYXVsdCA9IGlzUHJlc2VudChjb25maWcudXNlQXNEZWZhdWx0KSAmJiBjb25maWcudXNlQXNEZWZhdWx0O1xuICAgIH1cbiAgICB2YXIgcmVjb2duaXplciA9IG5ldyBSb3V0ZVJlY29nbml6ZXIoY29uZmlnLnBhdGgsIGhhbmRsZXIpO1xuXG4gICAgdGhpcy5fYXNzZXJ0Tm9IYXNoQ29sbGlzaW9uKHJlY29nbml6ZXIuaGFzaCwgY29uZmlnLnBhdGgpO1xuXG4gICAgaWYgKHVzZUFzRGVmYXVsdCkge1xuICAgICAgaWYgKGlzUHJlc2VudCh0aGlzLmRlZmF1bHRSb3V0ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYE9ubHkgb25lIHJvdXRlIGNhbiBiZSBkZWZhdWx0YCk7XG4gICAgICB9XG4gICAgICB0aGlzLmRlZmF1bHRSb3V0ZSA9IHJlY29nbml6ZXI7XG4gICAgfVxuXG4gICAgdGhpcy5tYXRjaGVycy5wdXNoKHJlY29nbml6ZXIpO1xuICAgIGlmIChpc1ByZXNlbnQoY29uZmlnLm5hbWUpKSB7XG4gICAgICB0aGlzLm5hbWVzLnNldChjb25maWcubmFtZSwgcmVjb2duaXplcik7XG4gICAgfVxuICAgIHJldHVybiByZWNvZ25pemVyLnRlcm1pbmFsO1xuICB9XG5cblxuICBwcml2YXRlIF9hc3NlcnROb0hhc2hDb2xsaXNpb24oaGFzaDogc3RyaW5nLCBwYXRoKSB7XG4gICAgdGhpcy5tYXRjaGVycy5mb3JFYWNoKChtYXRjaGVyKSA9PiB7XG4gICAgICBpZiAoaGFzaCA9PSBtYXRjaGVyLmhhc2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgICBgQ29uZmlndXJhdGlvbiAnJHtwYXRofScgY29uZmxpY3RzIHdpdGggZXhpc3Rpbmcgcm91dGUgJyR7bWF0Y2hlci5wYXRofSdgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdpdmVuIGEgVVJMLCByZXR1cm5zIGEgbGlzdCBvZiBgUm91dGVNYXRjaGBlcywgd2hpY2ggYXJlIHBhcnRpYWwgcmVjb2duaXRpb25zIGZvciBzb21lIHJvdXRlLlxuICAgKi9cbiAgcmVjb2duaXplKHVybFBhcnNlOiBVcmwpOiBQcm9taXNlPFJvdXRlTWF0Y2g+W10ge1xuICAgIHZhciBzb2x1dGlvbnMgPSBbXTtcblxuICAgIHRoaXMubWF0Y2hlcnMuZm9yRWFjaCgocm91dGVSZWNvZ25pemVyOiBBYnN0cmFjdFJlY29nbml6ZXIpID0+IHtcbiAgICAgIHZhciBwYXRoTWF0Y2ggPSByb3V0ZVJlY29nbml6ZXIucmVjb2duaXplKHVybFBhcnNlKTtcblxuICAgICAgaWYgKGlzUHJlc2VudChwYXRoTWF0Y2gpKSB7XG4gICAgICAgIHNvbHV0aW9ucy5wdXNoKHBhdGhNYXRjaCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc29sdXRpb25zO1xuICB9XG5cbiAgcmVjb2duaXplQXV4aWxpYXJ5KHVybFBhcnNlOiBVcmwpOiBQcm9taXNlPFJvdXRlTWF0Y2g+W10ge1xuICAgIHZhciByb3V0ZVJlY29nbml6ZXI6IFJvdXRlUmVjb2duaXplciA9IHRoaXMuYXV4Um91dGVzLmdldCh1cmxQYXJzZS5wYXRoKTtcbiAgICBpZiAoaXNQcmVzZW50KHJvdXRlUmVjb2duaXplcikpIHtcbiAgICAgIHJldHVybiBbcm91dGVSZWNvZ25pemVyLnJlY29nbml6ZSh1cmxQYXJzZSldO1xuICAgIH1cblxuICAgIHJldHVybiBbUHJvbWlzZVdyYXBwZXIucmVzb2x2ZShudWxsKV07XG4gIH1cblxuICBoYXNSb3V0ZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubmFtZXMuaGFzKG5hbWUpOyB9XG5cbiAgY29tcG9uZW50TG9hZGVkKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhhc1JvdXRlKG5hbWUpICYmIGlzUHJlc2VudCh0aGlzLm5hbWVzLmdldChuYW1lKS5oYW5kbGVyLmNvbXBvbmVudFR5cGUpO1xuICB9XG5cbiAgbG9hZENvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLm5hbWVzLmdldChuYW1lKS5oYW5kbGVyLnJlc29sdmVDb21wb25lbnRUeXBlKCk7XG4gIH1cblxuICBnZW5lcmF0ZShuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55KTogQ29tcG9uZW50SW5zdHJ1Y3Rpb24ge1xuICAgIHZhciBwYXRoUmVjb2duaXplcjogUm91dGVSZWNvZ25pemVyID0gdGhpcy5uYW1lcy5nZXQobmFtZSk7XG4gICAgaWYgKGlzQmxhbmsocGF0aFJlY29nbml6ZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGhSZWNvZ25pemVyLmdlbmVyYXRlKHBhcmFtcyk7XG4gIH1cblxuICBnZW5lcmF0ZUF1eGlsaWFyeShuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55KTogQ29tcG9uZW50SW5zdHJ1Y3Rpb24ge1xuICAgIHZhciBwYXRoUmVjb2duaXplcjogUm91dGVSZWNvZ25pemVyID0gdGhpcy5hdXhOYW1lcy5nZXQobmFtZSk7XG4gICAgaWYgKGlzQmxhbmsocGF0aFJlY29nbml6ZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGhSZWNvZ25pemVyLmdlbmVyYXRlKHBhcmFtcyk7XG4gIH1cbn1cbiJdfQ==
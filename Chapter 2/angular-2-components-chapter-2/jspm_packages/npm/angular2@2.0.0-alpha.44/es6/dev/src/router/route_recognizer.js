/* */ 
"format cjs";
import { StringWrapper, isBlank, isPresent } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { Map } from 'angular2/src/core/facade/collection';
import { PathRecognizer } from './path_recognizer';
import { Route, AsyncRoute, AuxRoute, Redirect } from './route_config_impl';
import { AsyncRouteHandler } from './async_route_handler';
import { SyncRouteHandler } from './sync_route_handler';
import { Url } from './url_parser';
/**
 * `RouteRecognizer` is responsible for recognizing routes for a single component.
 * It is consumed by `RouteRegistry`, which knows how to recognize an entire hierarchy of
 * components.
 */
export class RouteRecognizer {
    constructor() {
        this.names = new Map();
        this.auxRoutes = new Map();
        // TODO: optimize this into a trie
        this.matchers = [];
        // TODO: optimize this into a trie
        this.redirects = [];
    }
    config(config) {
        var handler;
        if (isPresent(config.as) && config.as[0].toUpperCase() != config.as[0]) {
            var suggestedAlias = config.as[0].toUpperCase() + config.as.substring(1);
            throw new BaseException(`Route '${config.path}' with alias '${config.as}' does not begin with an uppercase letter. Route aliases should be CamelCase like '${suggestedAlias}'.`);
        }
        if (config instanceof AuxRoute) {
            handler = new SyncRouteHandler(config.component, config.data);
            let path = StringWrapper.startsWith(config.path, '/') ? config.path.substring(1) : config.path;
            var recognizer = new PathRecognizer(config.path, handler);
            this.auxRoutes.set(path, recognizer);
            return recognizer.terminal;
        }
        if (config instanceof Redirect) {
            this.redirects.push(new Redirector(config.path, config.redirectTo));
            return true;
        }
        if (config instanceof Route) {
            handler = new SyncRouteHandler(config.component, config.data);
        }
        else if (config instanceof AsyncRoute) {
            handler = new AsyncRouteHandler(config.loader, config.data);
        }
        var recognizer = new PathRecognizer(config.path, handler);
        this.matchers.forEach((matcher) => {
            if (recognizer.hash == matcher.hash) {
                throw new BaseException(`Configuration '${config.path}' conflicts with existing route '${matcher.path}'`);
            }
        });
        this.matchers.push(recognizer);
        if (isPresent(config.as)) {
            this.names.set(config.as, recognizer);
        }
        return recognizer.terminal;
    }
    /**
     * Given a URL, returns a list of `RouteMatch`es, which are partial recognitions for some route.
     *
     */
    recognize(urlParse) {
        var solutions = [];
        urlParse = this._redirect(urlParse);
        this.matchers.forEach((pathRecognizer) => {
            var pathMatch = pathRecognizer.recognize(urlParse);
            if (isPresent(pathMatch)) {
                solutions.push(pathMatch);
            }
        });
        return solutions;
    }
    /** @internal */
    _redirect(urlParse) {
        for (var i = 0; i < this.redirects.length; i += 1) {
            let redirector = this.redirects[i];
            var redirectedUrl = redirector.redirect(urlParse);
            if (isPresent(redirectedUrl)) {
                return redirectedUrl;
            }
        }
        return urlParse;
    }
    recognizeAuxiliary(urlParse) {
        var pathRecognizer = this.auxRoutes.get(urlParse.path);
        if (isBlank(pathRecognizer)) {
            return null;
        }
        return pathRecognizer.recognize(urlParse);
    }
    hasRoute(name) { return this.names.has(name); }
    generate(name, params) {
        var pathRecognizer = this.names.get(name);
        if (isBlank(pathRecognizer)) {
            return null;
        }
        return pathRecognizer.generate(params);
    }
}
export class Redirector {
    constructor(path, redirectTo) {
        this.segments = [];
        this.toSegments = [];
        if (StringWrapper.startsWith(path, '/')) {
            path = path.substring(1);
        }
        this.segments = path.split('/');
        if (StringWrapper.startsWith(redirectTo, '/')) {
            redirectTo = redirectTo.substring(1);
        }
        this.toSegments = redirectTo.split('/');
    }
    /**
     * Returns `null` or a `ParsedUrl` representing the new path to match
     */
    redirect(urlParse) {
        for (var i = 0; i < this.segments.length; i += 1) {
            if (isBlank(urlParse)) {
                return null;
            }
            let segment = this.segments[i];
            if (segment != urlParse.path) {
                return null;
            }
            urlParse = urlParse.child;
        }
        for (var i = this.toSegments.length - 1; i >= 0; i -= 1) {
            let segment = this.toSegments[i];
            urlParse = new Url(segment, urlParse);
        }
        return urlParse;
    }
}
//# sourceMappingURL=route_recognizer.js.map
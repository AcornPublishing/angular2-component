/* */ 
"format cjs";
import { StringMapWrapper } from 'angular2/src/core/facade/collection';
import { unimplemented } from 'angular2/src/core/facade/exceptions';
import { isBlank, normalizeBlank } from 'angular2/src/core/facade/lang';
/**
 * `RouteParams` is an immutable map of parameters for the given route
 * based on the url matcher and optional parameters for that route.
 *
 * You can inject `RouteParams` into the constructor of a component to use it.
 *
 * ## Example
 *
 * ```
 * import {bootstrap, Component} from 'angular2/angular2';
 * import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {path: '/user/:id', component: UserCmp, as: 'UserCmp'},
 * ])
 * class AppCmp {}
 *
 * @Component({ template: 'user: {{id}}' })
 * class UserCmp {
 *   string: id;
 *   constructor(params: RouteParams) {
 *     this.id = params.get('id');
 *   }
 * }
 *
 * bootstrap(AppCmp, ROUTER_PROVIDERS);
 * ```
 */
export class RouteParams {
    constructor(params) {
        this.params = params;
    }
    get(param) { return normalizeBlank(StringMapWrapper.get(this.params, param)); }
}
/**
 * `Instruction` is a tree of {@link ComponentInstruction}s with all the information needed
 * to transition each component in the app to a given route, including all auxiliary routes.
 *
 * `Instruction`s can be created using {@link Router#generate}, and can be used to
 * perform route changes with {@link Router#navigateByInstruction}.
 *
 * ## Example
 *
 * ```
 * import {bootstrap, Component} from 'angular2/angular2';
 * import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   constructor(router: Router) {
 *     var instruction = router.generate(['/MyRoute']);
 *     router.navigateByInstruction(instruction);
 *   }
 * }
 *
 * bootstrap(AppCmp, ROUTER_PROVIDERS);
 * ```
 */
export class Instruction {
    constructor(component, child, auxInstruction) {
        this.component = component;
        this.child = child;
        this.auxInstruction = auxInstruction;
    }
    /**
     * Returns a new instruction that shares the state of the existing instruction, but with
     * the given child {@link Instruction} replacing the existing child.
     */
    replaceChild(child) {
        return new Instruction(this.component, child, this.auxInstruction);
    }
}
/**
 * Represents a partially completed instruction during recognition that only has the
 * primary (non-aux) route instructions matched.
 *
 * `PrimaryInstruction` is an internal class used by `RouteRecognizer` while it's
 * figuring out where to navigate.
 */
export class PrimaryInstruction {
    constructor(component, child, auxUrls) {
        this.component = component;
        this.child = child;
        this.auxUrls = auxUrls;
    }
}
export function stringifyInstruction(instruction) {
    return stringifyInstructionPath(instruction) + stringifyInstructionQuery(instruction);
}
export function stringifyInstructionPath(instruction) {
    return instruction.component.urlPath + stringifyAux(instruction) +
        stringifyPrimary(instruction.child);
}
export function stringifyInstructionQuery(instruction) {
    return instruction.component.urlParams.length > 0 ?
        ('?' + instruction.component.urlParams.join('&')) :
        '';
}
function stringifyPrimary(instruction) {
    if (isBlank(instruction)) {
        return '';
    }
    var params = instruction.component.urlParams.length > 0 ?
        (';' + instruction.component.urlParams.join(';')) :
        '';
    return '/' + instruction.component.urlPath + params + stringifyAux(instruction) +
        stringifyPrimary(instruction.child);
}
function stringifyAux(instruction) {
    var routes = [];
    StringMapWrapper.forEach(instruction.auxInstruction, (auxInstruction, _) => {
        routes.push(stringifyPrimary(auxInstruction));
    });
    if (routes.length > 0) {
        return '(' + routes.join('//') + ')';
    }
    return '';
}
/**
 * A `ComponentInstruction` represents the route state for a single component. An `Instruction` is
 * composed of a tree of these `ComponentInstruction`s.
 *
 * `ComponentInstructions` is a public API. Instances of `ComponentInstruction` are passed
 * to route lifecycle hooks, like {@link CanActivate}.
 *
 * `ComponentInstruction`s are [https://en.wikipedia.org/wiki/Hash_consing](hash consed). You should
 * never construct one yourself with "new." Instead, rely on {@link Router/PathRecognizer} to
 * construct `ComponentInstruction`s.
 *
 * You should not modify this object. It should be treated as immutable.
 */
export class ComponentInstruction {
    constructor() {
        this.reuse = false;
    }
    /**
     * Returns the component type of the represented route, or `null` if this instruction
     * hasn't been resolved.
     */
    get componentType() { return unimplemented(); }
    ;
    /**
     * Returns the specificity of the route associated with this `Instruction`.
     */
    get specificity() { return unimplemented(); }
    ;
    /**
     * Returns `true` if the component type of this instruction has no child {@link RouteConfig},
     * or `false` if it does.
     */
    get terminal() { return unimplemented(); }
    ;
}
export class ComponentInstruction_ extends ComponentInstruction {
    constructor(urlPath, urlParams, _recognizer, params = null) {
        super();
        this._recognizer = _recognizer;
        this.urlPath = urlPath;
        this.urlParams = urlParams;
        this.params = params;
    }
    get componentType() { return this._recognizer.handler.componentType; }
    resolveComponentType() { return this._recognizer.handler.resolveComponentType(); }
    get specificity() { return this._recognizer.specificity; }
    get terminal() { return this._recognizer.terminal; }
    routeData() { return this._recognizer.handler.data; }
}
//# sourceMappingURL=instruction.js.map
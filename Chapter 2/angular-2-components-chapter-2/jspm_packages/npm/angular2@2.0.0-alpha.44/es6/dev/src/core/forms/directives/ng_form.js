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
import { PromiseWrapper, ObservableWrapper, EventEmitter } from 'angular2/src/core/facade/async';
import { ListWrapper } from 'angular2/src/core/facade/collection';
import { isPresent, CONST_EXPR } from 'angular2/src/core/facade/lang';
import { Directive } from 'angular2/src/core/metadata';
import { forwardRef, Provider } from 'angular2/src/core/di';
import { ControlContainer } from './control_container';
import { ControlGroup, Control } from '../model';
import { setUpControl } from './shared';
const formDirectiveProvider = CONST_EXPR(new Provider(ControlContainer, { useExisting: forwardRef(() => NgForm) }));
/**
 * If `NgForm` is bound in a component, `<form>` elements in that component will be
 * upgraded to use the Angular form system.
 *
 * # Typical Use
 *
 * Include `FORM_DIRECTIVES` in the `directives` section of a {@link View} annotation
 * to use `NgForm` and its associated controls.
 *
 * # Structure
 *
 * An Angular form is a collection of `Control`s in some hierarchy.
 * `Control`s can be at the top level or can be organized in `ControlGroup`s
 * or `ControlArray`s. This hierarchy is reflected in the form's `value`, a
 * JSON object that mirrors the form structure.
 *
 * # Submission
 *
 * The `ng-submit` event signals when the user triggers a form submission.
 *
 * ### Example ([live demo](http://plnkr.co/edit/ltdgYj4P0iY64AR71EpL?p=preview))
 *
 *  ```typescript
 * @Component({
 *   selector: 'my-app',
 *   template: `
 *     <div>
 *       <p>Submit the form to see the data object Angular builds</p>
 *       <h2>NgForm demo</h2>
 *       <form #f="form" (ng-submit)="onSubmit(f.value)">
 *         <h3>Control group: credentials</h3>
 *         <div ng-control-group="credentials">
 *           <p>Login: <input type="text" ng-control="login"></p>
 *           <p>Password: <input type="password" ng-control="password"></p>
 *         </div>
 *         <h3>Control group: person</h3>
 *         <div ng-control-group="person">
 *           <p>First name: <input type="text" ng-control="firstName"></p>
 *           <p>Last name: <input type="text" ng-control="lastName"></p>
 *         </div>
 *         <button type="submit">Submit Form</button>
 *       <p>Form data submitted:</p>
 *       </form>
 *       <pre>{{data}}</pre>
 *     </div>
 * `,
 *   directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
 * })
 * export class App {
 *   constructor() {}
 *
 *   data: string;
 *
 *   onSubmit(data) {
 *     this.data = JSON.stringify(data, null, 2);
 *   }
 * }
 *  ```
 */
export let NgForm = class extends ControlContainer {
    constructor(...args) {
        super(...args);
        this.form = new ControlGroup({});
        this.ngSubmit = new EventEmitter();
    }
    get formDirective() { return this; }
    get control() { return this.form; }
    get path() { return []; }
    get controls() { return this.form.controls; }
    addControl(dir) {
        this._later(_ => {
            var container = this._findContainer(dir.path);
            var ctrl = new Control();
            setUpControl(ctrl, dir);
            container.addControl(dir.name, ctrl);
            ctrl.updateValidity();
        });
    }
    getControl(dir) { return this.form.find(dir.path); }
    removeControl(dir) {
        this._later(_ => {
            var container = this._findContainer(dir.path);
            if (isPresent(container)) {
                container.removeControl(dir.name);
                container.updateValidity();
            }
        });
    }
    addControlGroup(dir) {
        this._later(_ => {
            var container = this._findContainer(dir.path);
            var group = new ControlGroup({});
            container.addControl(dir.name, group);
            group.updateValidity();
        });
    }
    removeControlGroup(dir) {
        this._later(_ => {
            var container = this._findContainer(dir.path);
            if (isPresent(container)) {
                container.removeControl(dir.name);
                container.updateValidity();
            }
        });
    }
    getControlGroup(dir) {
        return this.form.find(dir.path);
    }
    updateModel(dir, value) {
        this._later(_ => {
            var ctrl = this.form.find(dir.path);
            ctrl.updateValue(value);
        });
    }
    onSubmit() {
        ObservableWrapper.callNext(this.ngSubmit, null);
        return false;
    }
    /** @internal */
    _findContainer(path) {
        path.pop();
        return ListWrapper.isEmpty(path) ? this.form : this.form.find(path);
    }
    /** @internal */
    _later(fn) { PromiseWrapper.then(PromiseWrapper.resolve(null), fn, (_) => { }); }
};
NgForm = __decorate([
    Directive({
        selector: 'form:not([ng-no-form]):not([ng-form-model]),ng-form,[ng-form]',
        bindings: [formDirectiveProvider],
        host: {
            '(submit)': 'onSubmit()',
        },
        outputs: ['ngSubmit'],
        exportAs: 'form'
    }), 
    __metadata('design:paramtypes', [])
], NgForm);
//# sourceMappingURL=ng_form.js.map
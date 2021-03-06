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
import { CONST_EXPR } from 'angular2/src/core/facade/lang';
import { EventEmitter, ObservableWrapper } from 'angular2/src/core/facade/async';
import { Directive } from 'angular2/src/core/metadata';
import { forwardRef, Provider, Inject, Optional } from 'angular2/src/core/di';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import { Control } from '../model';
import { Validators, NG_VALIDATORS } from '../validators';
import { setUpControl, isPropertyUpdated, selectValueAccessor } from './shared';
const formControlBinding = CONST_EXPR(new Provider(NgControl, { useExisting: forwardRef(() => NgModel) }));
/**
 * Binds a domain model to a form control.
 *
 * # Usage
 *
 * `ng-model` binds an existing domain model to a form control. For a
 * two-way binding, use `[(ng-model)]` to ensure the model updates in
 * both directions.
 *
 * ### Example ([live demo](http://plnkr.co/edit/R3UX5qDaUqFO2VYR0UzH?p=preview))
 *  ```typescript
 * @Component({
 *      selector: "search-comp",
 *      directives: [FORM_DIRECTIVES],
 *      template: `<input type='text' [(ng-model)]="searchQuery">`
 *      })
 * class SearchComp {
 *  searchQuery: string;
 * }
 *  ```
 */
export let NgModel = class extends NgControl {
    constructor(validators, valueAccessors) {
        super();
        /** @internal */
        this._control = new Control();
        /** @internal */
        this._added = false;
        this.update = new EventEmitter();
        this.validators = validators;
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    onChanges(changes) {
        if (!this._added) {
            setUpControl(this._control, this);
            this._control.updateValidity();
            this._added = true;
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            this._control.updateValue(this.model);
            this.viewModel = this.model;
        }
    }
    get control() { return this._control; }
    get path() { return []; }
    get validator() { return Validators.compose(this.validators); }
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        ObservableWrapper.callNext(this.update, newValue);
    }
};
NgModel = __decorate([
    Directive({
        selector: '[ng-model]:not([ng-control]):not([ng-form-control])',
        bindings: [formControlBinding],
        inputs: ['model: ngModel'],
        outputs: ['update: ngModelChange'],
        exportAs: 'form'
    }),
    __param(0, Optional()),
    __param(0, Inject(NG_VALIDATORS)),
    __param(1, Optional()),
    __param(1, Inject(NG_VALUE_ACCESSOR)), 
    __metadata('design:paramtypes', [Array, Array])
], NgModel);
//# sourceMappingURL=ng_model.js.map
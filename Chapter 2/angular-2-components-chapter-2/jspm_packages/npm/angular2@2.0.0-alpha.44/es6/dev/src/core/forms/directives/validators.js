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
import { forwardRef, Provider } from 'angular2/src/core/di';
import { CONST_EXPR } from 'angular2/src/core/facade/lang';
import { Attribute, Directive } from 'angular2/src/core/metadata';
import { Validators, NG_VALIDATORS } from '../validators';
import { NumberWrapper } from "angular2/src/core/facade/lang";
const REQUIRED_VALIDATOR = CONST_EXPR(new Provider(NG_VALIDATORS, { useValue: Validators.required, multi: true }));
export let RequiredValidator = class {
};
RequiredValidator = __decorate([
    Directive({
        selector: '[required][ng-control],[required][ng-form-control],[required][ng-model]',
        providers: [REQUIRED_VALIDATOR]
    }), 
    __metadata('design:paramtypes', [])
], RequiredValidator);
function createMinLengthValidator(dir) {
    return Validators.minLength(dir.minLength);
}
const MIN_LENGTH_VALIDATOR = CONST_EXPR(new Provider(NG_VALIDATORS, {
    useFactory: createMinLengthValidator,
    deps: [forwardRef(() => MinLengthValidator)],
    multi: true
}));
export let MinLengthValidator = class {
    constructor(minLength) {
        this.minLength = NumberWrapper.parseInt(minLength, 10);
    }
};
MinLengthValidator = __decorate([
    Directive({
        selector: '[minlength][ng-control],[minlength][ng-form-control],[minlength][ng-model]',
        providers: [MIN_LENGTH_VALIDATOR]
    }),
    __param(0, Attribute("minlength")), 
    __metadata('design:paramtypes', [String])
], MinLengthValidator);
function createMaxLengthValidator(dir) {
    return Validators.maxLength(dir.maxLength);
}
const MAX_LENGTH_VALIDATOR = CONST_EXPR(new Provider(NG_VALIDATORS, {
    useFactory: createMaxLengthValidator,
    deps: [forwardRef(() => MaxLengthValidator)],
    multi: true
}));
export let MaxLengthValidator = class {
    constructor(maxLength) {
        this.maxLength = NumberWrapper.parseInt(maxLength, 10);
    }
};
MaxLengthValidator = __decorate([
    Directive({
        selector: '[maxlength][ng-control],[maxlength][ng-form-control],[maxlength][ng-model]',
        providers: [MAX_LENGTH_VALIDATOR]
    }),
    __param(0, Attribute("maxlength")), 
    __metadata('design:paramtypes', [String])
], MaxLengthValidator);
//# sourceMappingURL=validators.js.map
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
import { Injectable } from 'angular2/src/core/di';
import { StringMapWrapper } from 'angular2/src/core/facade/collection';
import { isPresent, isArray } from 'angular2/src/core/facade/lang';
import * as modelModule from './model';
/**
 * Creates a form object from a user-specified configuration.
 *
 * # Example
 *
 * ```
 * import {Component, bootstrap} from 'angular2/angular2';
 * import {FormBuilder, Validators, FORM_DIRECTIVES, ControlGroup} from 'angular2/core';
 *
 * @Component({
 *   selector: 'login-comp',
 *   viewProviders: [FormBuilder],
 *   template: `
 *     <form [control-group]="loginForm">
 *       Login <input control="login">
 *
 *       <div control-group="passwordRetry">
 *         Password <input type="password" control="password">
 *         Confirm password <input type="password" control="passwordConfirmation">
 *       </div>
 *     </form>
 *   `,
 *   directives: [FORM_DIRECTIVES]
 * })
 * class LoginComp {
 *   loginForm: ControlGroup;
 *
 *   constructor(builder: FormBuilder) {
 *     this.loginForm = builder.group({
 *       login: ["", Validators.required],
 *
 *       passwordRetry: builder.group({
 *         password: ["", Validators.required],
 *         passwordConfirmation: ["", Validators.required]
 *       })
 *     });
 *   }
 * }
 *
 * bootstrap(LoginComp);
 * ```
 *
 * This example creates a {@link ControlGroup} that consists of a `login` {@link Control}, and a
 * nested {@link ControlGroup} that defines a `password` and a `passwordConfirmation`
 * {@link Control}:
 *
 * ```
 *  var loginForm = builder.group({
 *    login: ["", Validators.required],
 *
 *    passwordRetry: builder.group({
 *      password: ["", Validators.required],
 *      passwordConfirmation: ["", Validators.required]
 *    })
 *  });
 *
 *  ```
 */
export let FormBuilder = class {
    group(controlsConfig, extra = null) {
        var controls = this._reduceControls(controlsConfig);
        var optionals = isPresent(extra) ? StringMapWrapper.get(extra, "optionals") : null;
        var validator = isPresent(extra) ? StringMapWrapper.get(extra, "validator") : null;
        if (isPresent(validator)) {
            return new modelModule.ControlGroup(controls, optionals, validator);
        }
        else {
            return new modelModule.ControlGroup(controls, optionals);
        }
    }
    control(value, validator = null) {
        if (isPresent(validator)) {
            return new modelModule.Control(value, validator);
        }
        else {
            return new modelModule.Control(value);
        }
    }
    array(controlsConfig, validator = null) {
        var controls = controlsConfig.map(c => this._createControl(c));
        if (isPresent(validator)) {
            return new modelModule.ControlArray(controls, validator);
        }
        else {
            return new modelModule.ControlArray(controls);
        }
    }
    /** @internal */
    _reduceControls(controlsConfig) {
        var controls = {};
        StringMapWrapper.forEach(controlsConfig, (controlConfig, controlName) => {
            controls[controlName] = this._createControl(controlConfig);
        });
        return controls;
    }
    /** @internal */
    _createControl(controlConfig) {
        if (controlConfig instanceof modelModule.Control ||
            controlConfig instanceof modelModule.ControlGroup ||
            controlConfig instanceof modelModule.ControlArray) {
            return controlConfig;
        }
        else if (isArray(controlConfig)) {
            var value = controlConfig[0];
            var validator = controlConfig.length > 1 ? controlConfig[1] : null;
            return this.control(value, validator);
        }
        else {
            return this.control(controlConfig);
        }
    }
};
FormBuilder = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], FormBuilder);
//# sourceMappingURL=form_builder.js.map
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
import { isString, StringWrapper, CONST, isBlank } from 'angular2/src/core/facade/lang';
import { Injectable } from 'angular2/src/core/di';
import { Pipe } from 'angular2/src/core/metadata';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
/**
 * Implements lowercase transforms to text.
 *
 * # Example
 *
 * In this example we transform the user text lowercase.
 *
 *  ```
 * @Component({
 *   selector: "username-cmp",
 *   template: "Username: {{ user | lowercase }}"
 * })
 * class Username {
 *   user:string;
 * }
 *
 * ```
 */
export let LowerCasePipe = class {
    transform(value, args = null) {
        if (isBlank(value))
            return value;
        if (!isString(value)) {
            throw new InvalidPipeArgumentException(LowerCasePipe, value);
        }
        return StringWrapper.toLowerCase(value);
    }
};
LowerCasePipe = __decorate([
    CONST(),
    Pipe({ name: 'lowercase' }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], LowerCasePipe);
//# sourceMappingURL=lowercase_pipe.js.map
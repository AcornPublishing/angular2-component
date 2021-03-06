/* */ 
"format cjs";
import { AbstractControlDirective } from './abstract_control_directive';
/**
 * A base class that all control directive extend.
 * It binds a {@link Control} object to a DOM element.
 */
// Cannot currently be abstract because it would contain
// an abstract method in the public API, and we cannot reflect
// on that in Dart due to https://github.com/dart-lang/sdk/issues/18721
// Also we don't have abstract setters, see https://github.com/Microsoft/TypeScript/issues/4669
export class NgControl extends AbstractControlDirective {
    constructor(...args) {
        super(...args);
        this.name = null;
        this.valueAccessor = null;
    }
    get validator() { return null; }
    get path() { return null; }
    viewToModelUpdate(newValue) { }
}
//# sourceMappingURL=ng_control.js.map
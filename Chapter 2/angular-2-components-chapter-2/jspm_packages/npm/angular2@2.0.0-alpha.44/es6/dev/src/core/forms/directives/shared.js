/* */ 
"format cjs";
import { ListWrapper, StringMapWrapper } from 'angular2/src/core/facade/collection';
import { isBlank, isPresent, looseIdentical } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { Validators } from '../validators';
import { DefaultValueAccessor } from './default_value_accessor';
import { NumberValueAccessor } from './number_value_accessor';
import { CheckboxControlValueAccessor } from './checkbox_value_accessor';
import { SelectControlValueAccessor } from './select_control_value_accessor';
export function controlPath(name, parent) {
    var p = ListWrapper.clone(parent.path);
    p.push(name);
    return p;
}
export function setUpControl(control, dir) {
    if (isBlank(control))
        _throwError(dir, "Cannot find control");
    if (isBlank(dir.valueAccessor))
        _throwError(dir, "No value accessor for");
    control.validator = Validators.compose([control.validator, dir.validator]);
    dir.valueAccessor.writeValue(control.value);
    // view -> model
    dir.valueAccessor.registerOnChange(newValue => {
        dir.viewToModelUpdate(newValue);
        control.updateValue(newValue, { emitModelToViewChange: false });
        control.markAsDirty();
    });
    // model -> view
    control.registerOnChange(newValue => dir.valueAccessor.writeValue(newValue));
    // touched
    dir.valueAccessor.registerOnTouched(() => control.markAsTouched());
}
function _throwError(dir, message) {
    var path = dir.path.join(" -> ");
    throw new BaseException(`${message} '${path}'`);
}
export function setProperty(renderer, elementRef, propName, propValue) {
    renderer.setElementProperty(elementRef, propName, propValue);
}
export function isPropertyUpdated(changes, viewModel) {
    if (!StringMapWrapper.contains(changes, "model"))
        return false;
    var change = changes["model"];
    if (change.isFirstChange())
        return true;
    return !looseIdentical(viewModel, change.currentValue);
}
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
export function selectValueAccessor(dir, valueAccessors) {
    if (isBlank(valueAccessors))
        return null;
    var defaultAccessor;
    var builtinAccessor;
    var customAccessor;
    valueAccessors.forEach(v => {
        if (v instanceof DefaultValueAccessor) {
            defaultAccessor = v;
        }
        else if (v instanceof CheckboxControlValueAccessor || v instanceof NumberValueAccessor ||
            v instanceof SelectControlValueAccessor) {
            if (isPresent(builtinAccessor))
                _throwError(dir, "More than one built-in value accessor matches");
            builtinAccessor = v;
        }
        else {
            if (isPresent(customAccessor))
                _throwError(dir, "More than one custom value accessor matches");
            customAccessor = v;
        }
    });
    if (isPresent(customAccessor))
        return customAccessor;
    if (isPresent(builtinAccessor))
        return builtinAccessor;
    if (isPresent(defaultAccessor))
        return defaultAccessor;
    _throwError(dir, "No valid value accessor for");
    return null;
}
//# sourceMappingURL=shared.js.map
/* */ 
"format cjs";
import { BrowserDomAdapter } from 'angular2/src/core/dom/browser_adapter';
import { document, window } from 'angular2/src/core/facade/browser';
import { NumberWrapper, isBlank } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
var DOM = new BrowserDomAdapter();
export function getIntParameter(name) {
    return NumberWrapper.parseInt(getStringParameter(name), 10);
}
export function getStringParameter(name) {
    var els = DOM.querySelectorAll(document, `input[name="${name}"]`);
    var value;
    var el;
    for (var i = 0; i < els.length; i++) {
        el = els[i];
        var type = DOM.type(el);
        if ((type != 'radio' && type != 'checkbox') || DOM.getChecked(el)) {
            value = DOM.getValue(el);
            break;
        }
    }
    if (isBlank(value)) {
        throw new BaseException(`Could not find and input field with name ${name}`);
    }
    return value;
}
export function bindAction(selector, callback) {
    var el = DOM.querySelector(document, selector);
    DOM.on(el, 'click', function (_) { callback(); });
}
export function microBenchmark(name, iterationCount, callback) {
    var durationName = `${name}/${iterationCount}`;
    window.console.time(durationName);
    callback();
    window.console.timeEnd(durationName);
}
export function windowProfile(name) {
    window.console.profile(name);
}
export function windowProfileEnd(name) {
    window.console.profileEnd(name);
}
//# sourceMappingURL=benchmark_util.js.map
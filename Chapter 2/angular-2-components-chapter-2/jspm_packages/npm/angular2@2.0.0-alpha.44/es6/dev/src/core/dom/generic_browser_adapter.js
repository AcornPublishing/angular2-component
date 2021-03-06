/* */ 
"format cjs";
import { ListWrapper, StringMapWrapper } from 'angular2/src/core/facade/collection';
import { isPresent, isFunction, StringWrapper } from 'angular2/src/core/facade/lang';
import { DomAdapter } from './dom_adapter';
import { XHRImpl } from 'angular2/src/core/compiler/xhr_impl';
/**
 * Provides DOM operations in any browser environment.
 */
export class GenericBrowserDomAdapter extends DomAdapter {
    constructor() {
        super();
        this._animationPrefix = null;
        this._transitionEnd = null;
        try {
            var element = this.createElement('div', this.defaultDoc());
            if (isPresent(this.getStyle(element, 'animationName'))) {
                this._animationPrefix = '';
            }
            else {
                var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (isPresent(this.getStyle(element, domPrefixes[i] + 'AnimationName'))) {
                        this._animationPrefix = '-' + StringWrapper.toLowerCase(domPrefixes[i]) + '-';
                        break;
                    }
                }
            }
            var transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
            };
            StringMapWrapper.forEach(transEndEventNames, (value, key) => {
                if (isPresent(this.getStyle(element, key))) {
                    this._transitionEnd = value;
                }
            });
        }
        catch (e) {
            this._animationPrefix = null;
            this._transitionEnd = null;
        }
    }
    getXHR() { return XHRImpl; }
    getDistributedNodes(el) { return el.getDistributedNodes(); }
    resolveAndSetHref(el, baseUrl, href) {
        el.href = href == null ? baseUrl : baseUrl + '/../' + href;
    }
    cssToRules(css) {
        var style = this.createStyleElement(css);
        this.appendChild(this.defaultDoc().head, style);
        var rules = [];
        if (isPresent(style.sheet)) {
            // TODO(sorvell): Firefox throws when accessing the rules of a stylesheet
            // with an @import
            // https://bugzilla.mozilla.org/show_bug.cgi?id=625013
            try {
                var rawRules = style.sheet.cssRules;
                rules = ListWrapper.createFixedSize(rawRules.length);
                for (var i = 0; i < rawRules.length; i++) {
                    rules[i] = rawRules[i];
                }
            }
            catch (e) {
            }
        }
        else {
        }
        this.remove(style);
        return rules;
    }
    supportsDOMEvents() { return true; }
    supportsNativeShadowDOM() {
        return isFunction(this.defaultDoc().body.createShadowRoot);
    }
    supportsUnprefixedCssAnimation() {
        return isPresent(this.defaultDoc().body.style) &&
            isPresent(this.defaultDoc().body.style.animationName);
    }
    getAnimationPrefix() {
        return isPresent(this._animationPrefix) ? this._animationPrefix : "";
    }
    getTransitionEnd() { return isPresent(this._transitionEnd) ? this._transitionEnd : ""; }
    supportsAnimation() {
        return isPresent(this._animationPrefix) && isPresent(this._transitionEnd);
    }
}
//# sourceMappingURL=generic_browser_adapter.js.map
/* */ 
"format cjs";
import { isBlank } from 'angular2/src/core/facade/lang';
const NG_CONTENT_SELECT_ATTR = 'select';
const NG_CONTENT_ELEMENT = 'ng-content';
const LINK_ELEMENT = 'link';
const LINK_STYLE_REL_ATTR = 'rel';
const LINK_STYLE_HREF_ATTR = 'href';
const LINK_STYLE_REL_VALUE = 'stylesheet';
const STYLE_ELEMENT = 'style';
const SCRIPT_ELEMENT = 'script';
const NG_NON_BINDABLE_ATTR = 'ng-non-bindable';
export function preparseElement(ast) {
    var selectAttr = null;
    var hrefAttr = null;
    var relAttr = null;
    var nonBindable = false;
    ast.attrs.forEach(attr => {
        if (attr.name == NG_CONTENT_SELECT_ATTR) {
            selectAttr = attr.value;
        }
        else if (attr.name == LINK_STYLE_HREF_ATTR) {
            hrefAttr = attr.value;
        }
        else if (attr.name == LINK_STYLE_REL_ATTR) {
            relAttr = attr.value;
        }
        else if (attr.name == NG_NON_BINDABLE_ATTR) {
            nonBindable = true;
        }
    });
    selectAttr = normalizeNgContentSelect(selectAttr);
    var nodeName = ast.name;
    var type = PreparsedElementType.OTHER;
    if (nodeName == NG_CONTENT_ELEMENT) {
        type = PreparsedElementType.NG_CONTENT;
    }
    else if (nodeName == STYLE_ELEMENT) {
        type = PreparsedElementType.STYLE;
    }
    else if (nodeName == SCRIPT_ELEMENT) {
        type = PreparsedElementType.SCRIPT;
    }
    else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
        type = PreparsedElementType.STYLESHEET;
    }
    return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable);
}
export var PreparsedElementType;
(function (PreparsedElementType) {
    PreparsedElementType[PreparsedElementType["NG_CONTENT"] = 0] = "NG_CONTENT";
    PreparsedElementType[PreparsedElementType["STYLE"] = 1] = "STYLE";
    PreparsedElementType[PreparsedElementType["STYLESHEET"] = 2] = "STYLESHEET";
    PreparsedElementType[PreparsedElementType["SCRIPT"] = 3] = "SCRIPT";
    PreparsedElementType[PreparsedElementType["OTHER"] = 4] = "OTHER";
})(PreparsedElementType || (PreparsedElementType = {}));
export class PreparsedElement {
    constructor(type, selectAttr, hrefAttr, nonBindable) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
    }
}
function normalizeNgContentSelect(selectAttr) {
    if (isBlank(selectAttr) || selectAttr.length === 0) {
        return '*';
    }
    return selectAttr;
}
//# sourceMappingURL=template_preparser.js.map
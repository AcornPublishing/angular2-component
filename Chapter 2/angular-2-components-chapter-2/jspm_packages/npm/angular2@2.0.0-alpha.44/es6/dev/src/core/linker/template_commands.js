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
import { CONST_EXPR, CONST } from 'angular2/src/core/facade/lang';
var _nextTemplateId = 0;
export function nextTemplateId() {
    return _nextTemplateId++;
}
/**
 * A compiled host template.
 *
 * This is const as we are storing it as annotation
 * for the compiled component type.
 */
export let CompiledHostTemplate = class {
    // Note: _templateGetter is a function so that CompiledHostTemplate can be
    // a const!
    constructor(_templateGetter) {
        this._templateGetter = _templateGetter;
    }
    getTemplate() { return this._templateGetter(); }
};
CompiledHostTemplate = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Function])
], CompiledHostTemplate);
/**
 * A compiled template.
 */
export class CompiledTemplate {
    // Note: paramGetter is a function so that we can have cycles between templates!
    // paramGetter returns a tuple with:
    // - ChangeDetector factory function
    // - TemplateCmd[]
    // - styles
    constructor(id, _dataGetter) {
        this.id = id;
        this._dataGetter = _dataGetter;
    }
    getData(appId) {
        var data = this._dataGetter(appId, this.id);
        return new CompiledTemplateData(data[0], data[1], data[2]);
    }
}
export class CompiledTemplateData {
    constructor(changeDetectorFactory, commands, styles) {
        this.changeDetectorFactory = changeDetectorFactory;
        this.commands = commands;
        this.styles = styles;
    }
}
const EMPTY_ARR = CONST_EXPR([]);
export class TextCmd {
    constructor(value, isBound, ngContentIndex) {
        this.value = value;
        this.isBound = isBound;
        this.ngContentIndex = ngContentIndex;
    }
    visit(visitor, context) {
        return visitor.visitText(this, context);
    }
}
export function text(value, isBound, ngContentIndex) {
    return new TextCmd(value, isBound, ngContentIndex);
}
export class NgContentCmd {
    constructor(index, ngContentIndex) {
        this.index = index;
        this.ngContentIndex = ngContentIndex;
        this.isBound = false;
    }
    visit(visitor, context) {
        return visitor.visitNgContent(this, context);
    }
}
export function ngContent(index, ngContentIndex) {
    return new NgContentCmd(index, ngContentIndex);
}
export class BeginElementCmd {
    constructor(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex) {
        this.name = name;
        this.attrNameAndValues = attrNameAndValues;
        this.eventTargetAndNames = eventTargetAndNames;
        this.variableNameAndValues = variableNameAndValues;
        this.directives = directives;
        this.isBound = isBound;
        this.ngContentIndex = ngContentIndex;
    }
    visit(visitor, context) {
        return visitor.visitBeginElement(this, context);
    }
}
export function beginElement(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex) {
    return new BeginElementCmd(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex);
}
export class EndElementCmd {
    visit(visitor, context) {
        return visitor.visitEndElement(context);
    }
}
export function endElement() {
    return new EndElementCmd();
}
export class BeginComponentCmd {
    constructor(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex, template) {
        this.name = name;
        this.attrNameAndValues = attrNameAndValues;
        this.eventTargetAndNames = eventTargetAndNames;
        this.variableNameAndValues = variableNameAndValues;
        this.directives = directives;
        this.nativeShadow = nativeShadow;
        this.ngContentIndex = ngContentIndex;
        this.template = template;
        this.isBound = true;
        this.templateId = template.id;
    }
    visit(visitor, context) {
        return visitor.visitBeginComponent(this, context);
    }
}
export function beginComponent(name, attrNameAnsValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex, template) {
    return new BeginComponentCmd(name, attrNameAnsValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex, template);
}
export class EndComponentCmd {
    visit(visitor, context) {
        return visitor.visitEndComponent(context);
    }
}
export function endComponent() {
    return new EndComponentCmd();
}
export class EmbeddedTemplateCmd {
    constructor(attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, changeDetectorFactory, children) {
        this.attrNameAndValues = attrNameAndValues;
        this.variableNameAndValues = variableNameAndValues;
        this.directives = directives;
        this.isMerged = isMerged;
        this.ngContentIndex = ngContentIndex;
        this.changeDetectorFactory = changeDetectorFactory;
        this.children = children;
        this.isBound = true;
        this.name = null;
        this.eventTargetAndNames = EMPTY_ARR;
    }
    visit(visitor, context) {
        return visitor.visitEmbeddedTemplate(this, context);
    }
}
export function embeddedTemplate(attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, changeDetectorFactory, children) {
    return new EmbeddedTemplateCmd(attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, changeDetectorFactory, children);
}
export function visitAllCommands(visitor, cmds, context = null) {
    for (var i = 0; i < cmds.length; i++) {
        cmds[i].visit(visitor, context);
    }
}
//# sourceMappingURL=template_commands.js.map
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
import { isPresent, isBlank, isString, StringWrapper } from 'angular2/src/core/facade/lang';
import { SetWrapper, StringMapWrapper, ListWrapper } from 'angular2/src/core/facade/collection';
import { text, ngContent, beginElement, endElement, beginComponent, endComponent, embeddedTemplate } from 'angular2/src/core/linker/template_commands';
import { templateVisitAll } from './template_ast';
import { SourceExpression, moduleRef } from './source_module';
import { ViewEncapsulation } from 'angular2/src/core/metadata/view';
import { shimHostAttribute, shimContentAttribute, shimContentAttributeExpr, shimHostAttributeExpr } from './style_compiler';
import { escapeSingleQuoteString, MODULE_SUFFIX } from './util';
import { Injectable } from 'angular2/src/core/di';
export var TEMPLATE_COMMANDS_MODULE_REF = moduleRef(`package:angular2/src/core/linker/template_commands${MODULE_SUFFIX}`);
const IMPLICIT_TEMPLATE_VAR = '\$implicit';
const CLASS_ATTR = 'class';
const STYLE_ATTR = 'style';
export let CommandCompiler = class {
    compileComponentRuntime(component, appId, templateId, template, changeDetectorFactories, componentTemplateFactory) {
        var visitor = new CommandBuilderVisitor(new RuntimeCommandFactory(component, appId, templateId, componentTemplateFactory, changeDetectorFactories), 0);
        templateVisitAll(visitor, template);
        return visitor.result;
    }
    compileComponentCodeGen(component, appIdExpr, templateIdExpr, template, changeDetectorFactoryExpressions, componentTemplateFactory) {
        var visitor = new CommandBuilderVisitor(new CodegenCommandFactory(component, appIdExpr, templateIdExpr, componentTemplateFactory, changeDetectorFactoryExpressions), 0);
        templateVisitAll(visitor, template);
        var source = `[${visitor.result.join(',')}]`;
        return new SourceExpression([], source);
    }
};
CommandCompiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], CommandCompiler);
class RuntimeCommandFactory {
    constructor(component, appId, templateId, componentTemplateFactory, changeDetectorFactories) {
        this.component = component;
        this.appId = appId;
        this.templateId = templateId;
        this.componentTemplateFactory = componentTemplateFactory;
        this.changeDetectorFactories = changeDetectorFactories;
    }
    _mapDirectives(directives) {
        return directives.map(directive => directive.type.runtime);
    }
    _addStyleShimAttributes(attrNameAndValues, localComponent, localTemplateId) {
        var additionalStyles = [];
        if (isPresent(localComponent) &&
            localComponent.template.encapsulation === ViewEncapsulation.Emulated) {
            additionalStyles.push(shimHostAttribute(this.appId, localTemplateId));
            additionalStyles.push('');
        }
        if (this.component.template.encapsulation === ViewEncapsulation.Emulated) {
            additionalStyles.push(shimContentAttribute(this.appId, this.templateId));
            additionalStyles.push('');
        }
        return additionalStyles.concat(attrNameAndValues);
    }
    createText(value, isBound, ngContentIndex) {
        return text(value, isBound, ngContentIndex);
    }
    createNgContent(index, ngContentIndex) {
        return ngContent(index, ngContentIndex);
    }
    createBeginElement(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex) {
        return beginElement(name, this._addStyleShimAttributes(attrNameAndValues, null, null), eventTargetAndNames, variableNameAndValues, this._mapDirectives(directives), isBound, ngContentIndex);
    }
    createEndElement() { return endElement(); }
    createBeginComponent(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex) {
        var nestedTemplate = this.componentTemplateFactory(directives[0]);
        return beginComponent(name, this._addStyleShimAttributes(attrNameAndValues, directives[0], nestedTemplate.id), eventTargetAndNames, variableNameAndValues, this._mapDirectives(directives), nativeShadow, ngContentIndex, nestedTemplate);
    }
    createEndComponent() { return endComponent(); }
    createEmbeddedTemplate(embeddedTemplateIndex, attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, children) {
        return embeddedTemplate(attrNameAndValues, variableNameAndValues, this._mapDirectives(directives), isMerged, ngContentIndex, this.changeDetectorFactories[embeddedTemplateIndex], children);
    }
}
class CodegenCommandFactory {
    constructor(component, appIdExpr, templateIdExpr, componentTemplateFactory, changeDetectorFactoryExpressions) {
        this.component = component;
        this.appIdExpr = appIdExpr;
        this.templateIdExpr = templateIdExpr;
        this.componentTemplateFactory = componentTemplateFactory;
        this.changeDetectorFactoryExpressions = changeDetectorFactoryExpressions;
    }
    _addStyleShimAttributes(attrNameAndValues, localComponent, localTemplateIdExpr) {
        var additionalStlyes = [];
        if (isPresent(localComponent) &&
            localComponent.template.encapsulation === ViewEncapsulation.Emulated) {
            additionalStlyes.push(new Expression(shimHostAttributeExpr(this.appIdExpr, localTemplateIdExpr)));
            additionalStlyes.push('');
        }
        if (this.component.template.encapsulation === ViewEncapsulation.Emulated) {
            additionalStlyes.push(new Expression(shimContentAttributeExpr(this.appIdExpr, this.templateIdExpr)));
            additionalStlyes.push('');
        }
        return additionalStlyes.concat(attrNameAndValues);
    }
    createText(value, isBound, ngContentIndex) {
        return `${TEMPLATE_COMMANDS_MODULE_REF}text(${escapeSingleQuoteString(value)}, ${isBound}, ${ngContentIndex})`;
    }
    createNgContent(index, ngContentIndex) {
        return `${TEMPLATE_COMMANDS_MODULE_REF}ngContent(${index}, ${ngContentIndex})`;
    }
    createBeginElement(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex) {
        var attrsExpression = codeGenArray(this._addStyleShimAttributes(attrNameAndValues, null, null));
        return `${TEMPLATE_COMMANDS_MODULE_REF}beginElement(${escapeSingleQuoteString(name)}, ${attrsExpression}, ${codeGenArray(eventTargetAndNames)}, ${codeGenArray(variableNameAndValues)}, ${codeGenDirectivesArray(directives)}, ${isBound}, ${ngContentIndex})`;
    }
    createEndElement() { return `${TEMPLATE_COMMANDS_MODULE_REF}endElement()`; }
    createBeginComponent(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex) {
        var nestedCompExpr = this.componentTemplateFactory(directives[0]);
        var attrsExpression = codeGenArray(this._addStyleShimAttributes(attrNameAndValues, directives[0], `${nestedCompExpr}.id`));
        return `${TEMPLATE_COMMANDS_MODULE_REF}beginComponent(${escapeSingleQuoteString(name)}, ${attrsExpression}, ${codeGenArray(eventTargetAndNames)}, ${codeGenArray(variableNameAndValues)}, ${codeGenDirectivesArray(directives)}, ${nativeShadow}, ${ngContentIndex}, ${nestedCompExpr})`;
    }
    createEndComponent() { return `${TEMPLATE_COMMANDS_MODULE_REF}endComponent()`; }
    createEmbeddedTemplate(embeddedTemplateIndex, attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, children) {
        return `${TEMPLATE_COMMANDS_MODULE_REF}embeddedTemplate(${codeGenArray(attrNameAndValues)}, ${codeGenArray(variableNameAndValues)}, ` +
            `${codeGenDirectivesArray(directives)}, ${isMerged}, ${ngContentIndex}, ${this.changeDetectorFactoryExpressions[embeddedTemplateIndex]}, [${children.join(',')}])`;
    }
}
function visitAndReturnContext(visitor, asts, context) {
    templateVisitAll(visitor, asts, context);
    return context;
}
class CommandBuilderVisitor {
    constructor(commandFactory, embeddedTemplateIndex) {
        this.commandFactory = commandFactory;
        this.embeddedTemplateIndex = embeddedTemplateIndex;
        this.result = [];
        this.transitiveNgContentCount = 0;
    }
    _readAttrNameAndValues(directives, attrAsts) {
        var attrs = keyValueArrayToMap(visitAndReturnContext(this, attrAsts, []));
        directives.forEach(directiveMeta => {
            StringMapWrapper.forEach(directiveMeta.hostAttributes, (value, name) => {
                var prevValue = attrs[name];
                attrs[name] = isPresent(prevValue) ? mergeAttributeValue(name, prevValue, value) : value;
            });
        });
        return mapToKeyValueArray(attrs);
    }
    visitNgContent(ast, context) {
        this.transitiveNgContentCount++;
        this.result.push(this.commandFactory.createNgContent(ast.index, ast.ngContentIndex));
        return null;
    }
    visitEmbeddedTemplate(ast, context) {
        this.embeddedTemplateIndex++;
        var childVisitor = new CommandBuilderVisitor(this.commandFactory, this.embeddedTemplateIndex);
        templateVisitAll(childVisitor, ast.children);
        var isMerged = childVisitor.transitiveNgContentCount > 0;
        var variableNameAndValues = [];
        ast.vars.forEach((varAst) => {
            variableNameAndValues.push(varAst.name);
            variableNameAndValues.push(varAst.value.length > 0 ? varAst.value : IMPLICIT_TEMPLATE_VAR);
        });
        var directives = [];
        ListWrapper.forEachWithIndex(ast.directives, (directiveAst, index) => {
            directiveAst.visit(this, new DirectiveContext(index, [], [], directives));
        });
        this.result.push(this.commandFactory.createEmbeddedTemplate(this.embeddedTemplateIndex, this._readAttrNameAndValues(directives, ast.attrs), variableNameAndValues, directives, isMerged, ast.ngContentIndex, childVisitor.result));
        this.transitiveNgContentCount += childVisitor.transitiveNgContentCount;
        this.embeddedTemplateIndex = childVisitor.embeddedTemplateIndex;
        return null;
    }
    visitElement(ast, context) {
        var component = ast.getComponent();
        var eventTargetAndNames = visitAndReturnContext(this, ast.outputs, []);
        var variableNameAndValues = [];
        if (isBlank(component)) {
            ast.exportAsVars.forEach((varAst) => {
                variableNameAndValues.push(varAst.name);
                variableNameAndValues.push(null);
            });
        }
        var directives = [];
        ListWrapper.forEachWithIndex(ast.directives, (directiveAst, index) => {
            directiveAst.visit(this, new DirectiveContext(index, eventTargetAndNames, variableNameAndValues, directives));
        });
        eventTargetAndNames = removeKeyValueArrayDuplicates(eventTargetAndNames);
        var attrNameAndValues = this._readAttrNameAndValues(directives, ast.attrs);
        if (isPresent(component)) {
            this.result.push(this.commandFactory.createBeginComponent(ast.name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, component.template.encapsulation === ViewEncapsulation.Native, ast.ngContentIndex));
            templateVisitAll(this, ast.children);
            this.result.push(this.commandFactory.createEndComponent());
        }
        else {
            this.result.push(this.commandFactory.createBeginElement(ast.name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, ast.isBound(), ast.ngContentIndex));
            templateVisitAll(this, ast.children);
            this.result.push(this.commandFactory.createEndElement());
        }
        return null;
    }
    visitVariable(ast, ctx) { return null; }
    visitAttr(ast, attrNameAndValues) {
        attrNameAndValues.push(ast.name);
        attrNameAndValues.push(ast.value);
        return null;
    }
    visitBoundText(ast, context) {
        this.result.push(this.commandFactory.createText(null, true, ast.ngContentIndex));
        return null;
    }
    visitText(ast, context) {
        this.result.push(this.commandFactory.createText(ast.value, false, ast.ngContentIndex));
        return null;
    }
    visitDirective(ast, ctx) {
        ctx.targetDirectives.push(ast.directive);
        templateVisitAll(this, ast.hostEvents, ctx.eventTargetAndNames);
        ast.exportAsVars.forEach(varAst => {
            ctx.targetVariableNameAndValues.push(varAst.name);
            ctx.targetVariableNameAndValues.push(ctx.index);
        });
        return null;
    }
    visitEvent(ast, eventTargetAndNames) {
        eventTargetAndNames.push(ast.target);
        eventTargetAndNames.push(ast.name);
        return null;
    }
    visitDirectiveProperty(ast, context) { return null; }
    visitElementProperty(ast, context) { return null; }
}
function removeKeyValueArrayDuplicates(keyValueArray) {
    var knownPairs = new Set();
    var resultKeyValueArray = [];
    for (var i = 0; i < keyValueArray.length; i += 2) {
        var key = keyValueArray[i];
        var value = keyValueArray[i + 1];
        var pairId = `${key}:${value}`;
        if (!SetWrapper.has(knownPairs, pairId)) {
            resultKeyValueArray.push(key);
            resultKeyValueArray.push(value);
            knownPairs.add(pairId);
        }
    }
    return resultKeyValueArray;
}
function keyValueArrayToMap(keyValueArr) {
    var data = {};
    for (var i = 0; i < keyValueArr.length; i += 2) {
        data[keyValueArr[i]] = keyValueArr[i + 1];
    }
    return data;
}
function mapToKeyValueArray(data) {
    var entryArray = [];
    StringMapWrapper.forEach(data, (value, name) => { entryArray.push([name, value]); });
    // We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    ListWrapper.sort(entryArray, (entry1, entry2) => StringWrapper.compare(entry1[0], entry2[0]));
    var keyValueArray = [];
    entryArray.forEach((entry) => {
        keyValueArray.push(entry[0]);
        keyValueArray.push(entry[1]);
    });
    return keyValueArray;
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
        return `${attrValue1} ${attrValue2}`;
    }
    else {
        return attrValue2;
    }
}
class DirectiveContext {
    constructor(index, eventTargetAndNames, targetVariableNameAndValues, targetDirectives) {
        this.index = index;
        this.eventTargetAndNames = eventTargetAndNames;
        this.targetVariableNameAndValues = targetVariableNameAndValues;
        this.targetDirectives = targetDirectives;
    }
}
class Expression {
    constructor(value) {
        this.value = value;
    }
}
function escapeValue(value) {
    if (value instanceof Expression) {
        return value.value;
    }
    else if (isString(value)) {
        return escapeSingleQuoteString(value);
    }
    else if (isBlank(value)) {
        return 'null';
    }
    else {
        return `${value}`;
    }
}
function codeGenArray(data) {
    return `[${data.map(escapeValue).join(',')}]`;
}
function codeGenDirectivesArray(directives) {
    var expressions = directives.map(directiveType => `${moduleRef(directiveType.type.moduleUrl)}${directiveType.type.name}`);
    return `[${expressions.join(',')}]`;
}
//# sourceMappingURL=command_compiler.js.map
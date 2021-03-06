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
import { isBlank } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { ListWrapper, SetWrapper } from 'angular2/src/core/facade/collection';
import { PromiseWrapper } from 'angular2/src/core/facade/async';
import { CompiledTemplate, nextTemplateId, CompiledHostTemplate } from 'angular2/src/core/linker/template_commands';
import { createHostComponentMeta, CompileDirectiveMetadata } from './directive_metadata';
import { Injectable } from 'angular2/src/core/di';
import { SourceModule, moduleRef } from './source_module';
import { ChangeDetectionCompiler } from './change_detector_compiler';
import { StyleCompiler } from './style_compiler';
import { CommandCompiler } from './command_compiler';
import { TemplateParser } from './template_parser';
import { TemplateNormalizer } from './template_normalizer';
import { RuntimeMetadataResolver } from './runtime_metadata';
import { APP_ID } from 'angular2/src/core/application_tokens';
import { TEMPLATE_COMMANDS_MODULE_REF } from './command_compiler';
import { IS_DART, codeGenExportVariable, codeGenValueFn, MODULE_SUFFIX } from './util';
import { Inject } from 'angular2/src/core/di';
export let TemplateCompiler = class {
    constructor(_runtimeMetadataResolver, _templateNormalizer, _templateParser, _styleCompiler, _commandCompiler, _cdCompiler, appId) {
        this._runtimeMetadataResolver = _runtimeMetadataResolver;
        this._templateNormalizer = _templateNormalizer;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._commandCompiler = _commandCompiler;
        this._cdCompiler = _cdCompiler;
        this._hostCacheKeys = new Map();
        this._compiledTemplateCache = new Map();
        this._compiledTemplateDone = new Map();
        this._appId = appId;
    }
    normalizeDirectiveMetadata(directive) {
        if (!directive.isComponent) {
            // For non components there is nothing to be normalized yet.
            return PromiseWrapper.resolve(directive);
        }
        var normalizedTemplatePromise;
        if (directive.isComponent) {
            normalizedTemplatePromise =
                this._templateNormalizer.normalizeTemplate(directive.type, directive.template);
        }
        else {
            normalizedTemplatePromise = PromiseWrapper.resolve(null);
        }
        return normalizedTemplatePromise.then((normalizedTemplate) => new CompileDirectiveMetadata({
            type: directive.type,
            isComponent: directive.isComponent,
            dynamicLoadable: directive.dynamicLoadable,
            selector: directive.selector,
            exportAs: directive.exportAs,
            changeDetection: directive.changeDetection,
            inputs: directive.inputs,
            outputs: directive.outputs,
            hostListeners: directive.hostListeners,
            hostProperties: directive.hostProperties,
            hostAttributes: directive.hostAttributes,
            lifecycleHooks: directive.lifecycleHooks, template: normalizedTemplate
        }));
    }
    compileHostComponentRuntime(type) {
        var hostCacheKey = this._hostCacheKeys.get(type);
        if (isBlank(hostCacheKey)) {
            hostCacheKey = new Object();
            this._hostCacheKeys.set(type, hostCacheKey);
            var compMeta = this._runtimeMetadataResolver.getMetadata(type);
            assertComponent(compMeta);
            var hostMeta = createHostComponentMeta(compMeta.type, compMeta.selector);
            this._compileComponentRuntime(hostCacheKey, hostMeta, [compMeta], new Set());
        }
        return this._compiledTemplateDone.get(hostCacheKey)
            .then(compiledTemplate => new CompiledHostTemplate(() => compiledTemplate));
    }
    clearCache() {
        this._hostCacheKeys.clear();
        this._styleCompiler.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledTemplateDone.clear();
    }
    _compileComponentRuntime(cacheKey, compMeta, viewDirectives, compilingComponentCacheKeys) {
        var compiledTemplate = this._compiledTemplateCache.get(cacheKey);
        var done = this._compiledTemplateDone.get(cacheKey);
        if (isBlank(compiledTemplate)) {
            var styles;
            var changeDetectorFactory;
            var commands;
            var templateId = nextTemplateId();
            compiledTemplate =
                new CompiledTemplate(templateId, (_a, _b) => [changeDetectorFactory, commands, styles]);
            this._compiledTemplateCache.set(cacheKey, compiledTemplate);
            compilingComponentCacheKeys.add(cacheKey);
            done =
                PromiseWrapper.all([
                    this._styleCompiler.compileComponentRuntime(this._appId, templateId, compMeta.template)
                ].concat(viewDirectives.map(dirMeta => this.normalizeDirectiveMetadata(dirMeta))))
                    .then((stylesAndNormalizedViewDirMetas) => {
                    var childPromises = [];
                    var normalizedViewDirMetas = stylesAndNormalizedViewDirMetas.slice(1);
                    var parsedTemplate = this._templateParser.parse(compMeta.template.template, normalizedViewDirMetas, compMeta.type.name);
                    var changeDetectorFactories = this._cdCompiler.compileComponentRuntime(compMeta.type, compMeta.changeDetection, parsedTemplate);
                    changeDetectorFactory = changeDetectorFactories[0];
                    styles = stylesAndNormalizedViewDirMetas[0];
                    commands = this._compileCommandsRuntime(compMeta, templateId, parsedTemplate, changeDetectorFactories, compilingComponentCacheKeys, childPromises);
                    return PromiseWrapper.all(childPromises);
                })
                    .then((_) => {
                    SetWrapper.delete(compilingComponentCacheKeys, cacheKey);
                    return compiledTemplate;
                });
            this._compiledTemplateDone.set(cacheKey, done);
        }
        return compiledTemplate;
    }
    _compileCommandsRuntime(compMeta, templateId, parsedTemplate, changeDetectorFactories, compilingComponentCacheKeys, childPromises) {
        return this._commandCompiler.compileComponentRuntime(compMeta, this._appId, templateId, parsedTemplate, changeDetectorFactories, (childComponentDir) => {
            var childCacheKey = childComponentDir.type.runtime;
            var childViewDirectives = this._runtimeMetadataResolver.getViewDirectivesMetadata(childComponentDir.type.runtime);
            var childIsRecursive = SetWrapper.has(compilingComponentCacheKeys, childCacheKey);
            var childTemplate = this._compileComponentRuntime(childCacheKey, childComponentDir, childViewDirectives, compilingComponentCacheKeys);
            if (!childIsRecursive) {
                // Only wait for a child if it is not a cycle
                childPromises.push(this._compiledTemplateDone.get(childCacheKey));
            }
            return childTemplate;
        });
    }
    compileTemplatesCodeGen(components) {
        if (components.length === 0) {
            throw new BaseException('No components given');
        }
        var declarations = [];
        var templateArguments = [];
        var componentMetas = [];
        var templateIdVariable = 'templateId';
        var appIdVariable = 'appId';
        components.forEach(componentWithDirs => {
            var compMeta = componentWithDirs.component;
            assertComponent(compMeta);
            componentMetas.push(compMeta);
            this._processTemplateCodeGen(compMeta, appIdVariable, templateIdVariable, componentWithDirs.directives, declarations, templateArguments);
            if (compMeta.dynamicLoadable) {
                var hostMeta = createHostComponentMeta(compMeta.type, compMeta.selector);
                componentMetas.push(hostMeta);
                this._processTemplateCodeGen(hostMeta, appIdVariable, templateIdVariable, [compMeta], declarations, templateArguments);
            }
        });
        ListWrapper.forEachWithIndex(componentMetas, (compMeta, index) => {
            var templateDataFn = codeGenValueFn([appIdVariable, templateIdVariable], `[${templateArguments[index].join(',')}]`);
            var compiledTemplateExpr = `new ${TEMPLATE_COMMANDS_MODULE_REF}CompiledTemplate(${TEMPLATE_COMMANDS_MODULE_REF}nextTemplateId(),${templateDataFn})`;
            var variableValueExpr;
            if (compMeta.type.isHost) {
                var factoryName = `_hostTemplateFactory${index}`;
                declarations.push(`${codeGenValueFn([], compiledTemplateExpr, factoryName)};`);
                var constructionKeyword = IS_DART ? 'const' : 'new';
                variableValueExpr =
                    `${constructionKeyword} ${TEMPLATE_COMMANDS_MODULE_REF}CompiledHostTemplate(${factoryName})`;
            }
            else {
                variableValueExpr = compiledTemplateExpr;
            }
            declarations.push(`${codeGenExportVariable(templateVariableName(compMeta.type), compMeta.type.isHost)}${variableValueExpr};`);
        });
        var moduleUrl = components[0].component.type.moduleUrl;
        return new SourceModule(`${templateModuleUrl(moduleUrl)}`, declarations.join('\n'));
    }
    compileStylesheetCodeGen(stylesheetUrl, cssText) {
        return this._styleCompiler.compileStylesheetCodeGen(stylesheetUrl, cssText);
    }
    _processTemplateCodeGen(compMeta, appIdExpr, templateIdExpr, directives, targetDeclarations, targetTemplateArguments) {
        var styleExpr = this._styleCompiler.compileComponentCodeGen(appIdExpr, templateIdExpr, compMeta.template);
        var parsedTemplate = this._templateParser.parse(compMeta.template.template, directives, compMeta.type.name);
        var changeDetectorsExprs = this._cdCompiler.compileComponentCodeGen(compMeta.type, compMeta.changeDetection, parsedTemplate);
        var commandsExpr = this._commandCompiler.compileComponentCodeGen(compMeta, appIdExpr, templateIdExpr, parsedTemplate, changeDetectorsExprs.expressions, codeGenComponentTemplateFactory);
        addAll(styleExpr.declarations, targetDeclarations);
        addAll(changeDetectorsExprs.declarations, targetDeclarations);
        addAll(commandsExpr.declarations, targetDeclarations);
        targetTemplateArguments.push([changeDetectorsExprs.expressions[0], commandsExpr.expression, styleExpr.expression]);
    }
};
TemplateCompiler = __decorate([
    Injectable(),
    __param(6, Inject(APP_ID)), 
    __metadata('design:paramtypes', [RuntimeMetadataResolver, TemplateNormalizer, TemplateParser, StyleCompiler, CommandCompiler, ChangeDetectionCompiler, String])
], TemplateCompiler);
export class NormalizedComponentWithViewDirectives {
    constructor(component, directives) {
        this.component = component;
        this.directives = directives;
    }
}
function assertComponent(meta) {
    if (!meta.isComponent) {
        throw new BaseException(`Could not compile '${meta.type.name}' because it is not a component.`);
    }
}
function templateVariableName(type) {
    return `${type.name}Template`;
}
function templateModuleUrl(moduleUrl) {
    var urlWithoutSuffix = moduleUrl.substring(0, moduleUrl.length - MODULE_SUFFIX.length);
    return `${urlWithoutSuffix}.template${MODULE_SUFFIX}`;
}
function addAll(source, target) {
    for (var i = 0; i < source.length; i++) {
        target.push(source[i]);
    }
}
function codeGenComponentTemplateFactory(nestedCompType) {
    return `${moduleRef(templateModuleUrl(nestedCompType.type.moduleUrl))}${templateVariableName(nestedCompType.type)}`;
}
//# sourceMappingURL=template_compiler.js.map
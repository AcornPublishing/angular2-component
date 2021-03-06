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
import { SourceModule, SourceExpression, moduleRef } from './source_module';
import { ViewEncapsulation } from 'angular2/src/core/metadata/view';
import { XHR } from 'angular2/src/core/compiler/xhr';
import { StringWrapper, isBlank } from 'angular2/src/core/facade/lang';
import { PromiseWrapper } from 'angular2/src/core/facade/async';
import { ShadowCss } from 'angular2/src/core/compiler/shadow_css';
import { UrlResolver } from 'angular2/src/core/compiler/url_resolver';
import { extractStyleUrls } from './style_url_resolver';
import { escapeSingleQuoteString, codeGenConcatArray, codeGenMapArray, codeGenReplaceAll, codeGenExportVariable, codeGenToString, MODULE_SUFFIX } from './util';
import { Injectable } from 'angular2/src/core/di';
const COMPONENT_VARIABLE = '%COMP%';
var COMPONENT_REGEX = /%COMP%/g;
const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
const HOST_ATTR_EXPR = `'_nghost-'+${COMPONENT_VARIABLE}`;
const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
const CONTENT_ATTR_EXPR = `'_ngcontent-'+${COMPONENT_VARIABLE}`;
export let StyleCompiler = class {
    constructor(_xhr, _urlResolver) {
        this._xhr = _xhr;
        this._urlResolver = _urlResolver;
        this._styleCache = new Map();
        this._shadowCss = new ShadowCss();
    }
    compileComponentRuntime(appId, templateId, template) {
        var styles = template.styles;
        var styleAbsUrls = template.styleUrls;
        return this._loadStyles(styles, styleAbsUrls, template.encapsulation === ViewEncapsulation.Emulated)
            .then(styles => styles.map(style => StringWrapper.replaceAll(style, COMPONENT_REGEX, componentId(appId, templateId))));
    }
    compileComponentCodeGen(appIdExpression, templateIdExpression, template) {
        var shim = template.encapsulation === ViewEncapsulation.Emulated;
        var suffix;
        if (shim) {
            suffix = codeGenMapArray(['style'], `style${codeGenReplaceAll(COMPONENT_VARIABLE, componentIdExpression(appIdExpression, templateIdExpression))}`);
        }
        else {
            suffix = '';
        }
        return this._styleCodeGen(template.styles, template.styleUrls, shim, suffix);
    }
    compileStylesheetCodeGen(stylesheetUrl, cssText) {
        var styleWithImports = extractStyleUrls(this._urlResolver, stylesheetUrl, cssText);
        return [
            this._styleModule(stylesheetUrl, false, this._styleCodeGen([styleWithImports.style], styleWithImports.styleUrls, false, '')),
            this._styleModule(stylesheetUrl, true, this._styleCodeGen([styleWithImports.style], styleWithImports.styleUrls, true, ''))
        ];
    }
    clearCache() { this._styleCache.clear(); }
    _loadStyles(plainStyles, absUrls, encapsulate) {
        var promises = absUrls.map((absUrl) => {
            var cacheKey = `${absUrl}${encapsulate ? '.shim' : ''}`;
            var result = this._styleCache.get(cacheKey);
            if (isBlank(result)) {
                result = this._xhr.get(absUrl).then((style) => {
                    var styleWithImports = extractStyleUrls(this._urlResolver, absUrl, style);
                    return this._loadStyles([styleWithImports.style], styleWithImports.styleUrls, encapsulate);
                });
                this._styleCache.set(cacheKey, result);
            }
            return result;
        });
        return PromiseWrapper.all(promises).then((nestedStyles) => {
            var result = plainStyles.map(plainStyle => this._shimIfNeeded(plainStyle, encapsulate));
            nestedStyles.forEach(styles => styles.forEach(style => result.push(style)));
            return result;
        });
    }
    _styleCodeGen(plainStyles, absUrls, shim, suffix) {
        var expressionSource = `(`;
        expressionSource +=
            `[${plainStyles.map(plainStyle => escapeSingleQuoteString(this._shimIfNeeded(plainStyle, shim))).join(',')}]`;
        for (var i = 0; i < absUrls.length; i++) {
            var moduleUrl = this._createModuleUrl(absUrls[i], shim);
            expressionSource += codeGenConcatArray(`${moduleRef(moduleUrl)}STYLES`);
        }
        expressionSource += `)${suffix}`;
        return new SourceExpression([], expressionSource);
    }
    _styleModule(stylesheetUrl, shim, expression) {
        var moduleSource = `
      ${expression.declarations.join('\n')}
      ${codeGenExportVariable('STYLES')}${expression.expression};
    `;
        return new SourceModule(this._createModuleUrl(stylesheetUrl, shim), moduleSource);
    }
    _shimIfNeeded(style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    }
    _createModuleUrl(stylesheetUrl, shim) {
        return shim ? `${stylesheetUrl}.shim${MODULE_SUFFIX}` : `${stylesheetUrl}${MODULE_SUFFIX}`;
    }
};
StyleCompiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [XHR, UrlResolver])
], StyleCompiler);
export function shimContentAttribute(appId, templateId) {
    return StringWrapper.replaceAll(CONTENT_ATTR, COMPONENT_REGEX, componentId(appId, templateId));
}
export function shimContentAttributeExpr(appIdExpr, templateIdExpr) {
    return StringWrapper.replaceAll(CONTENT_ATTR_EXPR, COMPONENT_REGEX, componentIdExpression(appIdExpr, templateIdExpr));
}
export function shimHostAttribute(appId, templateId) {
    return StringWrapper.replaceAll(HOST_ATTR, COMPONENT_REGEX, componentId(appId, templateId));
}
export function shimHostAttributeExpr(appIdExpr, templateIdExpr) {
    return StringWrapper.replaceAll(HOST_ATTR_EXPR, COMPONENT_REGEX, componentIdExpression(appIdExpr, templateIdExpr));
}
function componentId(appId, templateId) {
    return `${appId}-${templateId}`;
}
function componentIdExpression(appIdExpression, templateIdExpression) {
    return `${appIdExpression}+'-'+${codeGenToString(templateIdExpression)}`;
}
//# sourceMappingURL=style_compiler.js.map
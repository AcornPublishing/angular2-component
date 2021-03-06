/* */ 
"format cjs";
import { RegExpWrapper, StringWrapper, isPresent, isBlank } from 'angular2/src/core/facade/lang';
import { BaseException } from 'angular2/src/core/facade/exceptions';
import { Map, StringMapWrapper } from 'angular2/src/core/facade/collection';
import { RootUrl, serializeParams } from './url_parser';
import { ComponentInstruction_ } from './instruction';
class TouchMap {
    constructor(map) {
        this.map = {};
        this.keys = {};
        if (isPresent(map)) {
            StringMapWrapper.forEach(map, (value, key) => {
                this.map[key] = isPresent(value) ? value.toString() : null;
                this.keys[key] = true;
            });
        }
    }
    get(key) {
        StringMapWrapper.delete(this.keys, key);
        return this.map[key];
    }
    getUnused() {
        var unused = StringMapWrapper.create();
        var keys = StringMapWrapper.keys(this.keys);
        keys.forEach(key => unused[key] = StringMapWrapper.get(this.map, key));
        return unused;
    }
}
function normalizeString(obj) {
    if (isBlank(obj)) {
        return null;
    }
    else {
        return obj.toString();
    }
}
class ContinuationSegment {
    constructor() {
        this.name = '';
    }
    generate(params) { return ''; }
    match(path) { return true; }
}
class StaticSegment {
    constructor(path) {
        this.path = path;
        this.name = '';
    }
    match(path) { return path == this.path; }
    generate(params) { return this.path; }
}
class DynamicSegment {
    constructor(name) {
        this.name = name;
    }
    match(path) { return path.length > 0; }
    generate(params) {
        if (!StringMapWrapper.contains(params.map, this.name)) {
            throw new BaseException(`Route generator for '${this.name}' was not included in parameters passed.`);
        }
        return normalizeString(params.get(this.name));
    }
}
class StarSegment {
    constructor(name) {
        this.name = name;
    }
    match(path) { return true; }
    generate(params) { return normalizeString(params.get(this.name)); }
}
var paramMatcher = /^:([^\/]+)$/g;
var wildcardMatcher = /^\*([^\/]+)$/g;
function parsePathString(route) {
    // normalize route as not starting with a "/". Recognition will
    // also normalize.
    if (StringWrapper.startsWith(route, "/")) {
        route = StringWrapper.substring(route, 1);
    }
    var segments = splitBySlash(route);
    var results = [];
    var specificity = 0;
    // The "specificity" of a path is used to determine which route is used when multiple routes match
    // a URL.
    // Static segments (like "/foo") are the most specific, followed by dynamic segments (like
    // "/:id"). Star segments
    // add no specificity. Segments at the start of the path are more specific than proceeding ones.
    // The code below uses place values to combine the different types of segments into a single
    // integer that we can
    // sort later. Each static segment is worth hundreds of points of specificity (10000, 9900, ...,
    // 200), and each
    // dynamic segment is worth single points of specificity (100, 99, ... 2).
    if (segments.length > 98) {
        throw new BaseException(`'${route}' has more than the maximum supported number of segments.`);
    }
    var limit = segments.length - 1;
    for (var i = 0; i <= limit; i++) {
        var segment = segments[i], match;
        if (isPresent(match = RegExpWrapper.firstMatch(paramMatcher, segment))) {
            results.push(new DynamicSegment(match[1]));
            specificity += (100 - i);
        }
        else if (isPresent(match = RegExpWrapper.firstMatch(wildcardMatcher, segment))) {
            results.push(new StarSegment(match[1]));
        }
        else if (segment == '...') {
            if (i < limit) {
                // TODO (matsko): setup a proper error here `
                throw new BaseException(`Unexpected "..." before the end of the path for "${route}".`);
            }
            results.push(new ContinuationSegment());
        }
        else {
            results.push(new StaticSegment(segment));
            specificity += 100 * (100 - i);
        }
    }
    var result = StringMapWrapper.create();
    StringMapWrapper.set(result, 'segments', results);
    StringMapWrapper.set(result, 'specificity', specificity);
    return result;
}
// this function is used to determine whether a route config path like `/foo/:id` collides with
// `/foo/:name`
function pathDslHash(segments) {
    return segments.map((segment) => {
        if (segment instanceof StarSegment) {
            return '*';
        }
        else if (segment instanceof ContinuationSegment) {
            return '...';
        }
        else if (segment instanceof DynamicSegment) {
            return ':';
        }
        else if (segment instanceof StaticSegment) {
            return segment.path;
        }
    })
        .join('/');
}
function splitBySlash(url) {
    return url.split('/');
}
var RESERVED_CHARS = RegExpWrapper.create('//|\\(|\\)|;|\\?|=');
function assertPath(path) {
    if (StringWrapper.contains(path, '#')) {
        throw new BaseException(`Path "${path}" should not include "#". Use "HashLocationStrategy" instead.`);
    }
    var illegalCharacter = RegExpWrapper.firstMatch(RESERVED_CHARS, path);
    if (isPresent(illegalCharacter)) {
        throw new BaseException(`Path "${path}" contains "${illegalCharacter[0]}" which is not allowed in a route config.`);
    }
}
export class PathMatch {
    constructor(instruction, remaining, remainingAux) {
        this.instruction = instruction;
        this.remaining = remaining;
        this.remainingAux = remainingAux;
    }
}
// represents something like '/foo/:bar'
export class PathRecognizer {
    // TODO: cache component instruction instances by params and by ParsedUrl instance
    constructor(path, handler) {
        this.path = path;
        this.handler = handler;
        this.terminal = true;
        this._cache = new Map();
        assertPath(path);
        var parsed = parsePathString(path);
        this._segments = parsed['segments'];
        this.specificity = parsed['specificity'];
        this.hash = pathDslHash(this._segments);
        var lastSegment = this._segments[this._segments.length - 1];
        this.terminal = !(lastSegment instanceof ContinuationSegment);
    }
    recognize(beginningSegment) {
        var nextSegment = beginningSegment;
        var currentSegment;
        var positionalParams = {};
        var captured = [];
        for (var i = 0; i < this._segments.length; i += 1) {
            var segment = this._segments[i];
            currentSegment = nextSegment;
            if (segment instanceof ContinuationSegment) {
                break;
            }
            if (isPresent(currentSegment)) {
                captured.push(currentSegment.path);
                // the star segment consumes all of the remaining URL, including matrix params
                if (segment instanceof StarSegment) {
                    positionalParams[segment.name] = currentSegment.toString();
                    nextSegment = null;
                    break;
                }
                if (segment instanceof DynamicSegment) {
                    positionalParams[segment.name] = currentSegment.path;
                }
                else if (!segment.match(currentSegment.path)) {
                    return null;
                }
                nextSegment = currentSegment.child;
            }
            else if (!segment.match('')) {
                return null;
            }
        }
        if (this.terminal && isPresent(nextSegment)) {
            return null;
        }
        var urlPath = captured.join('/');
        var auxiliary;
        var instruction;
        var urlParams;
        var allParams;
        if (isPresent(currentSegment)) {
            // If this is the root component, read query params. Otherwise, read matrix params.
            var paramsSegment = beginningSegment instanceof RootUrl ? beginningSegment : currentSegment;
            allParams = isPresent(paramsSegment.params) ?
                StringMapWrapper.merge(paramsSegment.params, positionalParams) :
                positionalParams;
            urlParams = serializeParams(paramsSegment.params);
            auxiliary = currentSegment.auxiliary;
        }
        else {
            allParams = positionalParams;
            auxiliary = [];
            urlParams = [];
        }
        instruction = this._getInstruction(urlPath, urlParams, this, allParams);
        return new PathMatch(instruction, nextSegment, auxiliary);
    }
    generate(params) {
        var paramTokens = new TouchMap(params);
        var path = [];
        for (var i = 0; i < this._segments.length; i++) {
            let segment = this._segments[i];
            if (!(segment instanceof ContinuationSegment)) {
                path.push(segment.generate(paramTokens));
            }
        }
        var urlPath = path.join('/');
        var nonPositionalParams = paramTokens.getUnused();
        var urlParams = serializeParams(nonPositionalParams);
        return this._getInstruction(urlPath, urlParams, this, params);
    }
    _getInstruction(urlPath, urlParams, _recognizer, params) {
        var hashKey = urlPath + '?' + urlParams.join('?');
        if (this._cache.has(hashKey)) {
            return this._cache.get(hashKey);
        }
        var instruction = new ComponentInstruction_(urlPath, urlParams, _recognizer, params);
        this._cache.set(hashKey, instruction);
        return instruction;
    }
}
//# sourceMappingURL=path_recognizer.js.map
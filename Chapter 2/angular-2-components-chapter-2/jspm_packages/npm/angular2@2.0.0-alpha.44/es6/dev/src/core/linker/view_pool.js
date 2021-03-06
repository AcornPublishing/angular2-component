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
import { Inject, Injectable, OpaqueToken } from 'angular2/src/core/di';
import { Map } from 'angular2/src/core/facade/collection';
import { isPresent, isBlank, CONST_EXPR } from 'angular2/src/core/facade/lang';
export const APP_VIEW_POOL_CAPACITY = CONST_EXPR(new OpaqueToken('AppViewPool.viewPoolCapacity'));
export let AppViewPool = class {
    constructor(poolCapacityPerProtoView) {
        /** @internal */
        this._pooledViewsPerProtoView = new Map();
        this._poolCapacityPerProtoView = poolCapacityPerProtoView;
    }
    getView(protoView) {
        var pooledViews = this._pooledViewsPerProtoView.get(protoView);
        if (isPresent(pooledViews) && pooledViews.length > 0) {
            return pooledViews.pop();
        }
        return null;
    }
    returnView(view) {
        var protoView = view.proto;
        var pooledViews = this._pooledViewsPerProtoView.get(protoView);
        if (isBlank(pooledViews)) {
            pooledViews = [];
            this._pooledViewsPerProtoView.set(protoView, pooledViews);
        }
        var haveRemainingCapacity = pooledViews.length < this._poolCapacityPerProtoView;
        if (haveRemainingCapacity) {
            pooledViews.push(view);
        }
        return haveRemainingCapacity;
    }
};
AppViewPool = __decorate([
    Injectable(),
    __param(0, Inject(APP_VIEW_POOL_CAPACITY)), 
    __metadata('design:paramtypes', [Object])
], AppViewPool);
//# sourceMappingURL=view_pool.js.map
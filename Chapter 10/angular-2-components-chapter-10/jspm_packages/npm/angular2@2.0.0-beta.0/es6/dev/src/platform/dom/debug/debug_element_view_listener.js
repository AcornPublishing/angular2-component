/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST_EXPR, isPresent, NumberWrapper } from 'angular2/src/facade/lang';
import { Map } from 'angular2/src/facade/collection';
import { Injectable, Provider } from 'angular2/src/core/di';
import { AppViewListener } from 'angular2/src/core/linker/view_listener';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { Renderer } from 'angular2/src/core/render/api';
import { DebugElement_ } from 'angular2/src/core/debug/debug_element';
const NG_ID_PROPERTY = 'ngid';
const INSPECT_GLOBAL_NAME = 'ng.probe';
const NG_ID_SEPARATOR = '#';
// Need to keep the views in a global Map so that multiple angular apps are supported
var _allIdsByView = new Map();
var _allViewsById = new Map();
var _nextId = 0;
function _setElementId(element, indices) {
    if (isPresent(element) && DOM.isElementNode(element)) {
        DOM.setData(element, NG_ID_PROPERTY, indices.join(NG_ID_SEPARATOR));
    }
}
function _getElementId(element) {
    var elId = DOM.getData(element, NG_ID_PROPERTY);
    if (isPresent(elId)) {
        return elId.split(NG_ID_SEPARATOR).map(partStr => NumberWrapper.parseInt(partStr, 10));
    }
    else {
        return null;
    }
}
/**
 * Returns a {@link DebugElement} for the given native DOM element, or
 * null if the given native element does not have an Angular view associated
 * with it.
 */
export function inspectNativeElement(element) {
    var elId = _getElementId(element);
    if (isPresent(elId)) {
        var view = _allViewsById.get(elId[0]);
        if (isPresent(view)) {
            return new DebugElement_(view, elId[1]);
        }
    }
    return null;
}
export let DebugElementViewListener = class {
    constructor(_renderer) {
        this._renderer = _renderer;
        DOM.setGlobalVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
    }
    onViewCreated(view) {
        var viewId = _nextId++;
        _allViewsById.set(viewId, view);
        _allIdsByView.set(view, viewId);
        for (var i = 0; i < view.elementRefs.length; i++) {
            var el = view.elementRefs[i];
            _setElementId(this._renderer.getNativeElementSync(el), [viewId, i]);
        }
    }
    onViewDestroyed(view) {
        var viewId = _allIdsByView.get(view);
        _allIdsByView.delete(view);
        _allViewsById.delete(viewId);
    }
};
DebugElementViewListener = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Renderer])
], DebugElementViewListener);
/**
 * Providers which support debugging Angular applications (e.g. via `ng.probe`).
 *
 * ## Example
 *
 * {@example platform/dom/debug/ts/debug_element_view_listener/providers.ts region='providers'}
 */
export const ELEMENT_PROBE_PROVIDERS = CONST_EXPR([
    DebugElementViewListener,
    CONST_EXPR(new Provider(AppViewListener, { useExisting: DebugElementViewListener })),
]);
/**
 * Use {@link ELEMENT_PROBE_PROVIDERS}.
 *
 * @deprecated
 */
export const ELEMENT_PROBE_BINDINGS = ELEMENT_PROBE_PROVIDERS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfZWxlbWVudF92aWV3X2xpc3RlbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kZWJ1Zy9kZWJ1Z19lbGVtZW50X3ZpZXdfbGlzdGVuZXIudHMiXSwibmFtZXMiOlsiX3NldEVsZW1lbnRJZCIsIl9nZXRFbGVtZW50SWQiLCJpbnNwZWN0TmF0aXZlRWxlbWVudCIsIkRlYnVnRWxlbWVudFZpZXdMaXN0ZW5lciIsIkRlYnVnRWxlbWVudFZpZXdMaXN0ZW5lci5jb25zdHJ1Y3RvciIsIkRlYnVnRWxlbWVudFZpZXdMaXN0ZW5lci5vblZpZXdDcmVhdGVkIiwiRGVidWdFbGVtZW50Vmlld0xpc3RlbmVyLm9uVmlld0Rlc3Ryb3llZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBZ0IsTUFBTSwwQkFBMEI7T0FDckYsRUFBYSxHQUFHLEVBQWMsTUFBTSxnQ0FBZ0M7T0FDcEUsRUFBQyxVQUFVLEVBQVcsUUFBUSxFQUFDLE1BQU0sc0JBQXNCO09BQzNELEVBQUMsZUFBZSxFQUFDLE1BQU0sd0NBQXdDO09BRS9ELEVBQUMsR0FBRyxFQUFDLE1BQU0sdUNBQXVDO09BQ2xELEVBQUMsUUFBUSxFQUFDLE1BQU0sOEJBQThCO09BQzlDLEVBQWUsYUFBYSxFQUFDLE1BQU0sdUNBQXVDO0FBRWpGLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQztBQUM5QixNQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FBQztBQUV2QyxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFFNUIscUZBQXFGO0FBQ3JGLElBQUksYUFBYSxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO0FBQy9DLElBQUksYUFBYSxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO0FBRS9DLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztBQUVoQix1QkFBdUIsT0FBTyxFQUFFLE9BQWlCO0lBQy9D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LGFBQWFBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3JDQSxhQUFhQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMzQkEsYUFBYUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7SUFDL0JBLENBQUNBO0FBQ0hILENBQUNBO0FBckJEO0lBQUMsVUFBVSxFQUFFOzs2QkFxQlo7QUFFRDs7Ozs7O0dBTUc7QUFDSCxhQUFhLHVCQUF1QixHQUFVLFVBQVUsQ0FBQztJQUN2RCx3QkFBd0I7SUFDeEIsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLGVBQWUsRUFBRSxFQUFDLFdBQVcsRUFBRSx3QkFBd0IsRUFBQyxDQUFDLENBQUM7Q0FDbkYsQ0FBQyxDQUFDO0FBRUg7Ozs7R0FJRztBQUNILGFBQWEsc0JBQXNCLEdBQUcsdUJBQXVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNUX0VYUFIsIGlzUHJlc2VudCwgTnVtYmVyV3JhcHBlciwgU3RyaW5nV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TWFwV3JhcHBlciwgTWFwLCBMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgcHJvdmlkZSwgUHJvdmlkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7QXBwVmlld0xpc3RlbmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19saXN0ZW5lcic7XG5pbXBvcnQge0FwcFZpZXd9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3JztcbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7UmVuZGVyZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGknO1xuaW1wb3J0IHtEZWJ1Z0VsZW1lbnQsIERlYnVnRWxlbWVudF99IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RlYnVnL2RlYnVnX2VsZW1lbnQnO1xuXG5jb25zdCBOR19JRF9QUk9QRVJUWSA9ICduZ2lkJztcbmNvbnN0IElOU1BFQ1RfR0xPQkFMX05BTUUgPSAnbmcucHJvYmUnO1xuXG5jb25zdCBOR19JRF9TRVBBUkFUT1IgPSAnIyc7XG5cbi8vIE5lZWQgdG8ga2VlcCB0aGUgdmlld3MgaW4gYSBnbG9iYWwgTWFwIHNvIHRoYXQgbXVsdGlwbGUgYW5ndWxhciBhcHBzIGFyZSBzdXBwb3J0ZWRcbnZhciBfYWxsSWRzQnlWaWV3ID0gbmV3IE1hcDxBcHBWaWV3LCBudW1iZXI+KCk7XG52YXIgX2FsbFZpZXdzQnlJZCA9IG5ldyBNYXA8bnVtYmVyLCBBcHBWaWV3PigpO1xuXG52YXIgX25leHRJZCA9IDA7XG5cbmZ1bmN0aW9uIF9zZXRFbGVtZW50SWQoZWxlbWVudCwgaW5kaWNlczogbnVtYmVyW10pIHtcbiAgaWYgKGlzUHJlc2VudChlbGVtZW50KSAmJiBET00uaXNFbGVtZW50Tm9kZShlbGVtZW50KSkge1xuICAgIERPTS5zZXREYXRhKGVsZW1lbnQsIE5HX0lEX1BST1BFUlRZLCBpbmRpY2VzLmpvaW4oTkdfSURfU0VQQVJBVE9SKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldEVsZW1lbnRJZChlbGVtZW50KTogbnVtYmVyW10ge1xuICB2YXIgZWxJZCA9IERPTS5nZXREYXRhKGVsZW1lbnQsIE5HX0lEX1BST1BFUlRZKTtcbiAgaWYgKGlzUHJlc2VudChlbElkKSkge1xuICAgIHJldHVybiBlbElkLnNwbGl0KE5HX0lEX1NFUEFSQVRPUikubWFwKHBhcnRTdHIgPT4gTnVtYmVyV3JhcHBlci5wYXJzZUludChwYXJ0U3RyLCAxMCkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHtAbGluayBEZWJ1Z0VsZW1lbnR9IGZvciB0aGUgZ2l2ZW4gbmF0aXZlIERPTSBlbGVtZW50LCBvclxuICogbnVsbCBpZiB0aGUgZ2l2ZW4gbmF0aXZlIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBhbiBBbmd1bGFyIHZpZXcgYXNzb2NpYXRlZFxuICogd2l0aCBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc3BlY3ROYXRpdmVFbGVtZW50KGVsZW1lbnQpOiBEZWJ1Z0VsZW1lbnQge1xuICB2YXIgZWxJZCA9IF9nZXRFbGVtZW50SWQoZWxlbWVudCk7XG4gIGlmIChpc1ByZXNlbnQoZWxJZCkpIHtcbiAgICB2YXIgdmlldyA9IF9hbGxWaWV3c0J5SWQuZ2V0KGVsSWRbMF0pO1xuICAgIGlmIChpc1ByZXNlbnQodmlldykpIHtcbiAgICAgIHJldHVybiBuZXcgRGVidWdFbGVtZW50Xyh2aWV3LCBlbElkWzFdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZWJ1Z0VsZW1lbnRWaWV3TGlzdGVuZXIgaW1wbGVtZW50cyBBcHBWaWV3TGlzdGVuZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIpIHtcbiAgICBET00uc2V0R2xvYmFsVmFyKElOU1BFQ1RfR0xPQkFMX05BTUUsIGluc3BlY3ROYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIG9uVmlld0NyZWF0ZWQodmlldzogQXBwVmlldykge1xuICAgIHZhciB2aWV3SWQgPSBfbmV4dElkKys7XG4gICAgX2FsbFZpZXdzQnlJZC5zZXQodmlld0lkLCB2aWV3KTtcbiAgICBfYWxsSWRzQnlWaWV3LnNldCh2aWV3LCB2aWV3SWQpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5lbGVtZW50UmVmcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsID0gdmlldy5lbGVtZW50UmVmc1tpXTtcbiAgICAgIF9zZXRFbGVtZW50SWQodGhpcy5fcmVuZGVyZXIuZ2V0TmF0aXZlRWxlbWVudFN5bmMoZWwpLCBbdmlld0lkLCBpXSk7XG4gICAgfVxuICB9XG5cbiAgb25WaWV3RGVzdHJveWVkKHZpZXc6IEFwcFZpZXcpIHtcbiAgICB2YXIgdmlld0lkID0gX2FsbElkc0J5Vmlldy5nZXQodmlldyk7XG4gICAgX2FsbElkc0J5Vmlldy5kZWxldGUodmlldyk7XG4gICAgX2FsbFZpZXdzQnlJZC5kZWxldGUodmlld0lkKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3ZpZGVycyB3aGljaCBzdXBwb3J0IGRlYnVnZ2luZyBBbmd1bGFyIGFwcGxpY2F0aW9ucyAoZS5nLiB2aWEgYG5nLnByb2JlYCkuXG4gKlxuICogIyMgRXhhbXBsZVxuICpcbiAqIHtAZXhhbXBsZSBwbGF0Zm9ybS9kb20vZGVidWcvdHMvZGVidWdfZWxlbWVudF92aWV3X2xpc3RlbmVyL3Byb3ZpZGVycy50cyByZWdpb249J3Byb3ZpZGVycyd9XG4gKi9cbmV4cG9ydCBjb25zdCBFTEVNRU5UX1BST0JFX1BST1ZJREVSUzogYW55W10gPSBDT05TVF9FWFBSKFtcbiAgRGVidWdFbGVtZW50Vmlld0xpc3RlbmVyLFxuICBDT05TVF9FWFBSKG5ldyBQcm92aWRlcihBcHBWaWV3TGlzdGVuZXIsIHt1c2VFeGlzdGluZzogRGVidWdFbGVtZW50Vmlld0xpc3RlbmVyfSkpLFxuXSk7XG5cbi8qKlxuICogVXNlIHtAbGluayBFTEVNRU5UX1BST0JFX1BST1ZJREVSU30uXG4gKlxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGNvbnN0IEVMRU1FTlRfUFJPQkVfQklORElOR1MgPSBFTEVNRU5UX1BST0JFX1BST1ZJREVSUztcbiJdfQ==
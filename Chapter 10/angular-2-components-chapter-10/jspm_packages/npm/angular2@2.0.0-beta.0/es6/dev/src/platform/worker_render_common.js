/* */ 
"format cjs";
import { CONST_EXPR, IS_DART } from 'angular2/src/facade/lang';
import { MessageBus } from 'angular2/src/web_workers/shared/message_bus';
import { NgZone } from 'angular2/src/core/zone/ng_zone';
import { ExceptionHandler, APPLICATION_COMMON_PROVIDERS, PLATFORM_COMMON_PROVIDERS, Renderer, PLATFORM_INITIALIZER } from 'angular2/core';
import { EVENT_MANAGER_PLUGINS, EventManager } from 'angular2/platform/common_dom';
import { Provider, OpaqueToken } from 'angular2/src/core/di';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { DomEventsPlugin } from 'angular2/src/platform/dom/events/dom_events';
import { KeyEventsPlugin } from 'angular2/src/platform/dom/events/key_events';
import { HammerGesturesPlugin } from 'angular2/src/platform/dom/events/hammer_gestures';
import { DOCUMENT } from 'angular2/src/platform/dom/dom_tokens';
import { DomRenderer, DomRenderer_ } from 'angular2/src/platform/dom/dom_renderer';
import { DomSharedStylesHost } from 'angular2/src/platform/dom/shared_styles_host';
import { SharedStylesHost } from "angular2/src/platform/dom/shared_styles_host";
import { BrowserDetails } from 'angular2/src/animate/browser_details';
import { AnimationBuilder } from 'angular2/src/animate/animation_builder';
import { XHR } from 'angular2/compiler';
import { XHRImpl } from 'angular2/src/platform/browser/xhr_impl';
import { Testability } from 'angular2/src/core/testability/testability';
import { BrowserGetTestability } from 'angular2/src/platform/browser/testability';
import { BrowserDomAdapter } from './browser/browser_adapter';
import { wtfInit } from 'angular2/src/core/profile/wtf_init';
import { MessageBasedRenderer } from 'angular2/src/web_workers/ui/renderer';
import { MessageBasedXHRImpl } from 'angular2/src/web_workers/ui/xhr_impl';
import { ServiceMessageBrokerFactory, ServiceMessageBrokerFactory_ } from 'angular2/src/web_workers/shared/service_message_broker';
import { ClientMessageBrokerFactory, ClientMessageBrokerFactory_ } from 'angular2/src/web_workers/shared/client_message_broker';
import { Serializer } from 'angular2/src/web_workers/shared/serializer';
import { ON_WEB_WORKER } from 'angular2/src/web_workers/shared/api';
import { RenderProtoViewRefStore } from 'angular2/src/web_workers/shared/render_proto_view_ref_store';
import { RenderViewWithFragmentsStore } from 'angular2/src/web_workers/shared/render_view_with_fragments_store';
export const WORKER_SCRIPT = CONST_EXPR(new OpaqueToken("WebWorkerScript"));
// Message based Worker classes that listen on the MessageBus
export const WORKER_RENDER_MESSAGING_PROVIDERS = CONST_EXPR([MessageBasedRenderer, MessageBasedXHRImpl]);
export const WORKER_RENDER_PLATFORM = CONST_EXPR([
    PLATFORM_COMMON_PROVIDERS,
    new Provider(PLATFORM_INITIALIZER, { useValue: initWebWorkerRenderPlatform, multi: true })
]);
export const WORKER_RENDER_APP_COMMON = CONST_EXPR([
    APPLICATION_COMMON_PROVIDERS,
    WORKER_RENDER_MESSAGING_PROVIDERS,
    new Provider(ExceptionHandler, { useFactory: _exceptionHandler, deps: [] }),
    new Provider(DOCUMENT, { useFactory: _document, deps: [] }),
    // TODO(jteplitz602): Investigate if we definitely need EVENT_MANAGER on the render thread
    // #5298
    new Provider(EVENT_MANAGER_PLUGINS, { useClass: DomEventsPlugin, multi: true }),
    new Provider(EVENT_MANAGER_PLUGINS, { useClass: KeyEventsPlugin, multi: true }),
    new Provider(EVENT_MANAGER_PLUGINS, { useClass: HammerGesturesPlugin, multi: true }),
    new Provider(DomRenderer, { useClass: DomRenderer_ }),
    new Provider(Renderer, { useExisting: DomRenderer }),
    new Provider(SharedStylesHost, { useExisting: DomSharedStylesHost }),
    new Provider(XHR, { useClass: XHRImpl }),
    MessageBasedXHRImpl,
    new Provider(ServiceMessageBrokerFactory, { useClass: ServiceMessageBrokerFactory_ }),
    new Provider(ClientMessageBrokerFactory, { useClass: ClientMessageBrokerFactory_ }),
    Serializer,
    new Provider(ON_WEB_WORKER, { useValue: false }),
    RenderViewWithFragmentsStore,
    RenderProtoViewRefStore,
    DomSharedStylesHost,
    Testability,
    BrowserDetails,
    AnimationBuilder,
    EventManager
]);
export function initializeGenericWorkerRenderer(injector) {
    var bus = injector.get(MessageBus);
    let zone = injector.get(NgZone);
    bus.attachToZone(zone);
    zone.run(() => {
        WORKER_RENDER_MESSAGING_PROVIDERS.forEach((token) => { injector.get(token).start(); });
    });
}
export function initWebWorkerRenderPlatform() {
    BrowserDomAdapter.makeCurrent();
    wtfInit();
    BrowserGetTestability.init();
}
function _exceptionHandler() {
    return new ExceptionHandler(DOM, !IS_DART);
}
function _document() {
    return DOM.defaultDoc();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3JlbmRlcl9jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcl9jb21tb24udHMiXSwibmFtZXMiOlsiaW5pdGlhbGl6ZUdlbmVyaWNXb3JrZXJSZW5kZXJlciIsImluaXRXZWJXb3JrZXJSZW5kZXJQbGF0Zm9ybSIsIl9leGNlcHRpb25IYW5kbGVyIiwiX2RvY3VtZW50Il0sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSwwQkFBMEI7T0FDckQsRUFBQyxVQUFVLEVBQUMsTUFBTSw2Q0FBNkM7T0FDL0QsRUFBQyxNQUFNLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDOUMsRUFLTCxnQkFBZ0IsRUFHaEIsNEJBQTRCLEVBQzVCLHlCQUF5QixFQUN6QixRQUFRLEVBQ1Isb0JBQW9CLEVBRXJCLE1BQU0sZUFBZTtPQUNmLEVBQUMscUJBQXFCLEVBQUUsWUFBWSxFQUFDLE1BQU0sOEJBQThCO09BQ3pFLEVBQVUsUUFBUSxFQUFZLFdBQVcsRUFBQyxNQUFNLHNCQUFzQjtPQUV0RSxFQUFDLEdBQUcsRUFBQyxNQUFNLHVDQUF1QztPQUNsRCxFQUFDLGVBQWUsRUFBQyxNQUFNLDZDQUE2QztPQUNwRSxFQUFDLGVBQWUsRUFBQyxNQUFNLDZDQUE2QztPQUNwRSxFQUFDLG9CQUFvQixFQUFDLE1BQU0sa0RBQWtEO09BQzlFLEVBQUMsUUFBUSxFQUFDLE1BQU0sc0NBQXNDO09BQ3RELEVBQUMsV0FBVyxFQUFFLFlBQVksRUFBQyxNQUFNLHdDQUF3QztPQUN6RSxFQUFDLG1CQUFtQixFQUFDLE1BQU0sOENBQThDO09BQ3pFLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw4Q0FBOEM7T0FDdEUsRUFBQyxjQUFjLEVBQUMsTUFBTSxzQ0FBc0M7T0FDNUQsRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHdDQUF3QztPQUNoRSxFQUFDLEdBQUcsRUFBQyxNQUFNLG1CQUFtQjtP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ZCxnQkFBZ0I7SUFDaEIsWUFBWTtDQUNiLENBQUMsQ0FBQztBQUVILGdEQUFnRCxRQUFrQjtJQUNoRUEsSUFBSUEsR0FBR0EsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDbkNBLElBQUlBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQ2hDQSxHQUFHQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUV2QkEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDUEEsaUNBQWlDQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxLQUFLQSxPQUFPQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUN6RkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDTEEsQ0FBQ0E7QUFFRDtJQUNFQyxpQkFBaUJBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO0lBQ2hDQSxPQUFPQSxFQUFFQSxDQUFDQTtJQUNWQSxxQkFBcUJBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO0FBQy9CQSxDQUFDQTtBQUVEO0lBQ0VDLE1BQU1BLENBQUNBLElBQUlBLGdCQUFnQkEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7QUFDN0NBLENBQUNBO0FBRUQ7SUFDRUMsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7QUFDMUJBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT05TVF9FWFBSLCBJU19EQVJUfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtNZXNzYWdlQnVzfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL21lc3NhZ2VfYnVzJztcbmltcG9ydCB7Tmdab25lfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS96b25lL25nX3pvbmUnO1xuaW1wb3J0IHtcbiAgUExBVEZPUk1fRElSRUNUSVZFUyxcbiAgUExBVEZPUk1fUElQRVMsXG4gIENvbXBvbmVudFJlZixcbiAgcGxhdGZvcm0sXG4gIEV4Y2VwdGlvbkhhbmRsZXIsXG4gIFJlZmxlY3RvcixcbiAgcmVmbGVjdG9yLFxuICBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxuICBSZW5kZXJlcixcbiAgUExBVEZPUk1fSU5JVElBTElaRVIsXG4gIEFQUF9JTklUSUFMSVpFUlxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7RVZFTlRfTUFOQUdFUl9QTFVHSU5TLCBFdmVudE1hbmFnZXJ9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2NvbW1vbl9kb20nO1xuaW1wb3J0IHtwcm92aWRlLCBQcm92aWRlciwgSW5qZWN0b3IsIE9wYXF1ZVRva2VufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG4vLyBUT0RPIGNoYW5nZSB0aGVzZSBpbXBvcnRzIG9uY2UgZG9tX2FkYXB0ZXIgaXMgbW92ZWQgb3V0IG9mIGNvcmVcbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7RG9tRXZlbnRzUGx1Z2lufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9kb21fZXZlbnRzJztcbmltcG9ydCB7S2V5RXZlbnRzUGx1Z2lufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9rZXlfZXZlbnRzJztcbmltcG9ydCB7SGFtbWVyR2VzdHVyZXNQbHVnaW59IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZXZlbnRzL2hhbW1lcl9nZXN0dXJlcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV90b2tlbnMnO1xuaW1wb3J0IHtEb21SZW5kZXJlciwgRG9tUmVuZGVyZXJffSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9yZW5kZXJlcic7XG5pbXBvcnQge0RvbVNoYXJlZFN0eWxlc0hvc3R9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vc2hhcmVkX3N0eWxlc19ob3N0JztcbmltcG9ydCB7U2hhcmVkU3R5bGVzSG9zdH0gZnJvbSBcImFuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vc2hhcmVkX3N0eWxlc19ob3N0XCI7XG5pbXBvcnQge0Jyb3dzZXJEZXRhaWxzfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9icm93c2VyX2RldGFpbHMnO1xuaW1wb3J0IHtBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9hbmltYXRpb25fYnVpbGRlcic7XG5pbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvY29tcGlsZXInO1xuaW1wb3J0IHtYSFJJbXBsfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci94aHJfaW1wbCc7XG5pbXBvcnQge1Rlc3RhYmlsaXR5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eSc7XG5pbXBvcnQge0Jyb3dzZXJHZXRUZXN0YWJpbGl0eX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvdGVzdGFiaWxpdHknO1xuaW1wb3J0IHtCcm93c2VyRG9tQWRhcHRlcn0gZnJvbSAnLi9icm93c2VyL2Jyb3dzZXJfYWRhcHRlcic7XG5pbXBvcnQge3d0ZkluaXR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3Byb2ZpbGUvd3RmX2luaXQnO1xuaW1wb3J0IHtNZXNzYWdlQmFzZWRSZW5kZXJlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3VpL3JlbmRlcmVyJztcbmltcG9ydCB7TWVzc2FnZUJhc2VkWEhSSW1wbH0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3VpL3hocl9pbXBsJztcbmltcG9ydCB7XG4gIFNlcnZpY2VNZXNzYWdlQnJva2VyRmFjdG9yeSxcbiAgU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5X1xufSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcnZpY2VfbWVzc2FnZV9icm9rZXInO1xuaW1wb3J0IHtcbiAgQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksXG4gIENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5X1xufSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL2NsaWVudF9tZXNzYWdlX2Jyb2tlcic7XG5pbXBvcnQge1NlcmlhbGl6ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplcic7XG5pbXBvcnQge09OX1dFQl9XT1JLRVJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvYXBpJztcbmltcG9ydCB7UmVuZGVyUHJvdG9WaWV3UmVmU3RvcmV9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvcmVuZGVyX3Byb3RvX3ZpZXdfcmVmX3N0b3JlJztcbmltcG9ydCB7XG4gIFJlbmRlclZpZXdXaXRoRnJhZ21lbnRzU3RvcmVcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9yZW5kZXJfdmlld193aXRoX2ZyYWdtZW50c19zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBXT1JLRVJfU0NSSVBUOiBPcGFxdWVUb2tlbiA9IENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKFwiV2ViV29ya2VyU2NyaXB0XCIpKTtcblxuLy8gTWVzc2FnZSBiYXNlZCBXb3JrZXIgY2xhc3NlcyB0aGF0IGxpc3RlbiBvbiB0aGUgTWVzc2FnZUJ1c1xuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfTUVTU0FHSU5HX1BST1ZJREVSUzogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIENPTlNUX0VYUFIoW01lc3NhZ2VCYXNlZFJlbmRlcmVyLCBNZXNzYWdlQmFzZWRYSFJJbXBsXSk7XG5cbmV4cG9ydCBjb25zdCBXT1JLRVJfUkVOREVSX1BMQVRGT1JNOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9IENPTlNUX0VYUFIoW1xuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxuICBuZXcgUHJvdmlkZXIoUExBVEZPUk1fSU5JVElBTElaRVIsIHt1c2VWYWx1ZTogaW5pdFdlYldvcmtlclJlbmRlclBsYXRmb3JtLCBtdWx0aTogdHJ1ZX0pXG5dKTtcblxuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfQVBQX0NPTU1PTjogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPSBDT05TVF9FWFBSKFtcbiAgQVBQTElDQVRJT05fQ09NTU9OX1BST1ZJREVSUyxcbiAgV09SS0VSX1JFTkRFUl9NRVNTQUdJTkdfUFJPVklERVJTLFxuICBuZXcgUHJvdmlkZXIoRXhjZXB0aW9uSGFuZGxlciwge3VzZUZhY3Rvcnk6IF9leGNlcHRpb25IYW5kbGVyLCBkZXBzOiBbXX0pLFxuICBuZXcgUHJvdmlkZXIoRE9DVU1FTlQsIHt1c2VGYWN0b3J5OiBfZG9jdW1lbnQsIGRlcHM6IFtdfSksXG4gIC8vIFRPRE8oanRlcGxpdHo2MDIpOiBJbnZlc3RpZ2F0ZSBpZiB3ZSBkZWZpbml0ZWx5IG5lZWQgRVZFTlRfTUFOQUdFUiBvbiB0aGUgcmVuZGVyIHRocmVhZFxuICAvLyAjNTI5OFxuICBuZXcgUHJvdmlkZXIoRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB7dXNlQ2xhc3M6IERvbUV2ZW50c1BsdWdpbiwgbXVsdGk6IHRydWV9KSxcbiAgbmV3IFByb3ZpZGVyKEVWRU5UX01BTkFHRVJfUExVR0lOUywge3VzZUNsYXNzOiBLZXlFdmVudHNQbHVnaW4sIG11bHRpOiB0cnVlfSksXG4gIG5ldyBQcm92aWRlcihFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHt1c2VDbGFzczogSGFtbWVyR2VzdHVyZXNQbHVnaW4sIG11bHRpOiB0cnVlfSksXG4gIG5ldyBQcm92aWRlcihEb21SZW5kZXJlciwge3VzZUNsYXNzOiBEb21SZW5kZXJlcl99KSxcbiAgbmV3IFByb3ZpZGVyKFJlbmRlcmVyLCB7dXNlRXhpc3Rpbmc6IERvbVJlbmRlcmVyfSksXG4gIG5ldyBQcm92aWRlcihTaGFyZWRTdHlsZXNIb3N0LCB7dXNlRXhpc3Rpbmc6IERvbVNoYXJlZFN0eWxlc0hvc3R9KSxcbiAgbmV3IFByb3ZpZGVyKFhIUiwge3VzZUNsYXNzOiBYSFJJbXBsfSksXG4gIE1lc3NhZ2VCYXNlZFhIUkltcGwsXG4gIG5ldyBQcm92aWRlcihTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3RvcnksIHt1c2VDbGFzczogU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5X30pLFxuICBuZXcgUHJvdmlkZXIoQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksIHt1c2VDbGFzczogQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnlffSksXG4gIFNlcmlhbGl6ZXIsXG4gIG5ldyBQcm92aWRlcihPTl9XRUJfV09SS0VSLCB7dXNlVmFsdWU6IGZhbHNlfSksXG4gIFJlbmRlclZpZXdXaXRoRnJhZ21lbnRzU3RvcmUsXG4gIFJlbmRlclByb3RvVmlld1JlZlN0b3JlLFxuICBEb21TaGFyZWRTdHlsZXNIb3N0LFxuICBUZXN0YWJpbGl0eSxcbiAgQnJvd3NlckRldGFpbHMsXG4gIEFuaW1hdGlvbkJ1aWxkZXIsXG4gIEV2ZW50TWFuYWdlclxuXSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplR2VuZXJpY1dvcmtlclJlbmRlcmVyKGluamVjdG9yOiBJbmplY3Rvcikge1xuICB2YXIgYnVzID0gaW5qZWN0b3IuZ2V0KE1lc3NhZ2VCdXMpO1xuICBsZXQgem9uZSA9IGluamVjdG9yLmdldChOZ1pvbmUpO1xuICBidXMuYXR0YWNoVG9ab25lKHpvbmUpO1xuXG4gIHpvbmUucnVuKCgpID0+IHtcbiAgICBXT1JLRVJfUkVOREVSX01FU1NBR0lOR19QUk9WSURFUlMuZm9yRWFjaCgodG9rZW4pID0+IHsgaW5qZWN0b3IuZ2V0KHRva2VuKS5zdGFydCgpOyB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0V2ViV29ya2VyUmVuZGVyUGxhdGZvcm0oKTogdm9pZCB7XG4gIEJyb3dzZXJEb21BZGFwdGVyLm1ha2VDdXJyZW50KCk7XG4gIHd0ZkluaXQoKTtcbiAgQnJvd3NlckdldFRlc3RhYmlsaXR5LmluaXQoKTtcbn1cblxuZnVuY3Rpb24gX2V4Y2VwdGlvbkhhbmRsZXIoKTogRXhjZXB0aW9uSGFuZGxlciB7XG4gIHJldHVybiBuZXcgRXhjZXB0aW9uSGFuZGxlcihET00sICFJU19EQVJUKTtcbn1cblxuZnVuY3Rpb24gX2RvY3VtZW50KCk6IGFueSB7XG4gIHJldHVybiBET00uZGVmYXVsdERvYygpO1xufVxuIl19
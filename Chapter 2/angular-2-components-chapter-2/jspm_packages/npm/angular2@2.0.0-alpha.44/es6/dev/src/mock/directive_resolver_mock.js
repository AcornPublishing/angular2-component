/* */ 
"format cjs";
import { Map } from 'angular2/src/core/facade/collection';
import { isPresent } from 'angular2/src/core/facade/lang';
import { DirectiveMetadata, ComponentMetadata } from '../core/metadata';
import { DirectiveResolver } from 'angular2/src/core/linker/directive_resolver';
export class MockDirectiveResolver extends DirectiveResolver {
    constructor(...args) {
        super(...args);
        this._providerOverrides = new Map();
        this.viewProviderOverrides = new Map();
    }
    resolve(type) {
        var dm = super.resolve(type);
        var providerOverrides = this._providerOverrides.get(type);
        var viewProviderOverrides = this.viewProviderOverrides.get(type);
        var providers = dm.providers;
        if (isPresent(providerOverrides)) {
            providers = dm.providers.concat(providerOverrides);
        }
        if (dm instanceof ComponentMetadata) {
            var viewProviders = dm.viewProviders;
            if (isPresent(viewProviderOverrides)) {
                viewProviders = dm.viewProviders.concat(viewProviderOverrides);
            }
            return new ComponentMetadata({
                selector: dm.selector,
                inputs: dm.inputs,
                outputs: dm.outputs,
                host: dm.host,
                exportAs: dm.exportAs,
                moduleId: dm.moduleId,
                queries: dm.queries,
                changeDetection: dm.changeDetection,
                providers: providers,
                viewProviders: viewProviders
            });
        }
        return new DirectiveMetadata({
            selector: dm.selector,
            inputs: dm.inputs,
            outputs: dm.outputs,
            host: dm.host,
            providers: providers,
            exportAs: dm.exportAs,
            moduleId: dm.moduleId,
            queries: dm.queries
        });
    }
    /**
     * @deprecated
     */
    setBindingsOverride(type, bindings) {
        this._providerOverrides.set(type, bindings);
    }
    /**
     * @deprecated
     */
    setViewBindingsOverride(type, viewBindings) {
        this.viewProviderOverrides.set(type, viewBindings);
    }
    setProvidersOverride(type, bindings) {
        this._providerOverrides.set(type, bindings);
    }
    setViewProvidersOverride(type, viewBindings) {
        this.viewProviderOverrides.set(type, viewBindings);
    }
}
//# sourceMappingURL=directive_resolver_mock.js.map
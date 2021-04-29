import {Injectable, Inject, Injector} from 'angular2/core';
import {RouteParams} from 'angular2/router';

@Injectable()
export class AllRouteParams {
  constructor(@Inject(Injector) injector) {
    AllRouteParams.getAllRouteParams(injector);
  }

  static getAllRouteParams(injector) {
    let params = null;
    while(injector) {
      const routeParams = injector.getOptional(RouteParams);
      if (routeParams) {
        if (params === null) {
          params = {};
        } else {
          params = Object.create(params);
        }

        Object.assign(params, routeParams.params);
      }
      injector = injector.parent;
    }
    debugger;
  }
}

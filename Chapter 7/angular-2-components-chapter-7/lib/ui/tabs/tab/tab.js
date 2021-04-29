import {Component, Input, ViewEncapsulation, HostBinding} from 'angular2/core';
import template from './tab.html!text';

import {RouterOutlet} from 'angular2/router';

@Component({
  selector: 'ngc-tab',
  host: {
    'class': 'tabs__tab'
  },
  template,
  encapsulation: ViewEncapsulation.None,
  directives: [RouterOutlet]
})
export default class Tab {
  @Input() name;
  @HostBinding('class.tabs__tab--active') active = false;
}

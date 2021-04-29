import {Component, Input, ViewEncapsulation, HostBinding} from 'angular2/angular2';
import template from './tab.html!text';

@Component({
  selector: 'ngc-tab',
  host: {
    'class': 'tabs__tab'
  },
  template,
  encapsulation: ViewEncapsulation.None
})
export default class Tab {
  @Input() name;
  @HostBinding('class.tabs__tab--active') active = false;
}

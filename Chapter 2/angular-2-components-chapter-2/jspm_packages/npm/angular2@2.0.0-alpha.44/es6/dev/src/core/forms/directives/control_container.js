/* */ 
"format cjs";
import { AbstractControlDirective } from './abstract_control_directive';
/**
 * A directive that contains multiple {@link NgControl}.
 *
 * Only used by the forms module.
 */
export class ControlContainer extends AbstractControlDirective {
    get formDirective() { return null; }
    get path() { return null; }
}
//# sourceMappingURL=control_container.js.map
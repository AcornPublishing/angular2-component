/* */ 
"format cjs";
import { Subject } from '../Subject';
import { multicast } from './multicast';
export function publish() {
    return multicast.call(this, new Subject());
}
//# sourceMappingURL=publish.js.map
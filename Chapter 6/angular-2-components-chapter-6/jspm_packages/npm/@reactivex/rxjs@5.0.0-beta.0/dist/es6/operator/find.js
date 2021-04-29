/* */ 
"format cjs";
import { FindValueOperator } from './find-support';
export function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate is not a function');
    }
    return this.lift(new FindValueOperator(predicate, this, false, thisArg));
}
//# sourceMappingURL=find.js.map
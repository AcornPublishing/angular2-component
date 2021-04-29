/* */ 
"format cjs";
import { distinctUntilChanged } from './distinctUntilChanged';
export function distinctUntilKeyChanged(key, compare) {
    return distinctUntilChanged.call(this, function (x, y) {
        if (compare) {
            return compare(x[key], y[key]);
        }
        return x[key] === y[key];
    });
}
//# sourceMappingURL=distinctUntilKeyChanged.js.map
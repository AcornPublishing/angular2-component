/* */ 
"format cjs";
import { ZipOperator } from './zip-support';
export function zipAll(project) {
    return this.lift(new ZipOperator(project));
}
//# sourceMappingURL=zipAll.js.map
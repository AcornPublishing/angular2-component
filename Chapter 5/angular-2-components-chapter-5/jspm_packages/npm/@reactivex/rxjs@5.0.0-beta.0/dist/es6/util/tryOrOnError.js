/* */ 
"format cjs";
export function tryOrOnError(target) {
    function tryCatcher() {
        try {
            tryCatcher.target.apply(this, arguments);
        }
        catch (e) {
            this.error(e);
        }
    }
    tryCatcher.target = target;
    return tryCatcher;
}
//# sourceMappingURL=tryOrOnError.js.map
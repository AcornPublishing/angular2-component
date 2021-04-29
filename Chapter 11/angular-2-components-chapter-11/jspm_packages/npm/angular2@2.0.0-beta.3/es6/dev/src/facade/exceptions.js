/* */ 
"format cjs";
import { ExceptionHandler } from './exception_handler';
export { ExceptionHandler } from './exception_handler';
export class BaseException extends Error {
    constructor(message = "--") {
        super(message);
        this.message = message;
        this.stack = (new Error(message)).stack;
    }
    toString() { return this.message; }
}
/**
 * Wraps an exception and provides additional context or information.
 */
export class WrappedException extends Error {
    constructor(_wrapperMessage, _originalException, _originalStack, _context) {
        super(_wrapperMessage);
        this._wrapperMessage = _wrapperMessage;
        this._originalException = _originalException;
        this._originalStack = _originalStack;
        this._context = _context;
        this._wrapperStack = (new Error(_wrapperMessage)).stack;
    }
    get wrapperMessage() { return this._wrapperMessage; }
    get wrapperStack() { return this._wrapperStack; }
    get originalException() { return this._originalException; }
    get originalStack() { return this._originalStack; }
    get context() { return this._context; }
    get message() { return ExceptionHandler.exceptionToString(this); }
    toString() { return this.message; }
}
export function makeTypeError(message) {
    return new TypeError(message);
}
export function unimplemented() {
    throw new BaseException('unimplemented');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucy50cyJdLCJuYW1lcyI6WyJCYXNlRXhjZXB0aW9uIiwiQmFzZUV4Y2VwdGlvbi5jb25zdHJ1Y3RvciIsIkJhc2VFeGNlcHRpb24udG9TdHJpbmciLCJXcmFwcGVkRXhjZXB0aW9uIiwiV3JhcHBlZEV4Y2VwdGlvbi5jb25zdHJ1Y3RvciIsIldyYXBwZWRFeGNlcHRpb24ud3JhcHBlck1lc3NhZ2UiLCJXcmFwcGVkRXhjZXB0aW9uLndyYXBwZXJTdGFjayIsIldyYXBwZWRFeGNlcHRpb24ub3JpZ2luYWxFeGNlcHRpb24iLCJXcmFwcGVkRXhjZXB0aW9uLm9yaWdpbmFsU3RhY2siLCJXcmFwcGVkRXhjZXB0aW9uLmNvbnRleHQiLCJXcmFwcGVkRXhjZXB0aW9uLm1lc3NhZ2UiLCJXcmFwcGVkRXhjZXB0aW9uLnRvU3RyaW5nIiwibWFrZVR5cGVFcnJvciIsInVuaW1wbGVtZW50ZWQiXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUI7QUFFcEQsU0FBUSxnQkFBZ0IsUUFBTyxxQkFBcUIsQ0FBQztBQUVyRCxtQ0FBbUMsS0FBSztJQUV0Q0EsWUFBbUJBLE9BQU9BLEdBQVdBLElBQUlBO1FBQ3ZDQyxNQUFNQSxPQUFPQSxDQUFDQSxDQUFDQTtRQURFQSxZQUFPQSxHQUFQQSxPQUFPQSxDQUFlQTtRQUV2Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDL0NBLENBQUNBO0lBRURELFFBQVFBLEtBQWFFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO0FBQzdDRixDQUFDQTtBQUVEOztHQUVHO0FBQ0gsc0NBQXNDLEtBQUs7SUFHekNHLFlBQW9CQSxlQUF1QkEsRUFBVUEsa0JBQWtCQSxFQUFVQSxjQUFlQSxFQUM1RUEsUUFBU0E7UUFDM0JDLE1BQU1BLGVBQWVBLENBQUNBLENBQUNBO1FBRkxBLG9CQUFlQSxHQUFmQSxlQUFlQSxDQUFRQTtRQUFVQSx1QkFBa0JBLEdBQWxCQSxrQkFBa0JBLENBQUFBO1FBQVVBLG1CQUFjQSxHQUFkQSxjQUFjQSxDQUFDQTtRQUM1RUEsYUFBUUEsR0FBUkEsUUFBUUEsQ0FBQ0E7UUFFM0JBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLENBQU1BLElBQUlBLEtBQUtBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBO0lBQy9EQSxDQUFDQTtJQUVERCxJQUFJQSxjQUFjQSxLQUFhRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUU3REYsSUFBSUEsWUFBWUEsS0FBVUcsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFHdERILElBQUlBLGlCQUFpQkEsS0FBVUksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUVoRUosSUFBSUEsYUFBYUEsS0FBVUssTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFHeERMLElBQUlBLE9BQU9BLEtBQVVNLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO0lBRTVDTixJQUFJQSxPQUFPQSxLQUFhTyxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFMUVQLFFBQVFBLEtBQWFRLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO0FBQzdDUixDQUFDQTtBQUVELDhCQUE4QixPQUFnQjtJQUM1Q1MsTUFBTUEsQ0FBQ0EsSUFBSUEsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7QUFDaENBLENBQUNBO0FBRUQ7SUFDRUMsTUFBTUEsSUFBSUEsYUFBYUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7QUFDM0NBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFeGNlcHRpb25IYW5kbGVyfSBmcm9tICcuL2V4Y2VwdGlvbl9oYW5kbGVyJztcblxuZXhwb3J0IHtFeGNlcHRpb25IYW5kbGVyfSBmcm9tICcuL2V4Y2VwdGlvbl9oYW5kbGVyJztcblxuZXhwb3J0IGNsYXNzIEJhc2VFeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XG4gIHB1YmxpYyBzdGFjazogYW55O1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWVzc2FnZTogc3RyaW5nID0gXCItLVwiKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5zdGFjayA9ICg8YW55Pm5ldyBFcnJvcihtZXNzYWdlKSkuc3RhY2s7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5tZXNzYWdlOyB9XG59XG5cbi8qKlxuICogV3JhcHMgYW4gZXhjZXB0aW9uIGFuZCBwcm92aWRlcyBhZGRpdGlvbmFsIGNvbnRleHQgb3IgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBXcmFwcGVkRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xuICBwcml2YXRlIF93cmFwcGVyU3RhY2s6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF93cmFwcGVyTWVzc2FnZTogc3RyaW5nLCBwcml2YXRlIF9vcmlnaW5hbEV4Y2VwdGlvbiwgcHJpdmF0ZSBfb3JpZ2luYWxTdGFjaz8sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NvbnRleHQ/KSB7XG4gICAgc3VwZXIoX3dyYXBwZXJNZXNzYWdlKTtcbiAgICB0aGlzLl93cmFwcGVyU3RhY2sgPSAoPGFueT5uZXcgRXJyb3IoX3dyYXBwZXJNZXNzYWdlKSkuc3RhY2s7XG4gIH1cblxuICBnZXQgd3JhcHBlck1lc3NhZ2UoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3dyYXBwZXJNZXNzYWdlOyB9XG5cbiAgZ2V0IHdyYXBwZXJTdGFjaygpOiBhbnkgeyByZXR1cm4gdGhpcy5fd3JhcHBlclN0YWNrOyB9XG5cblxuICBnZXQgb3JpZ2luYWxFeGNlcHRpb24oKTogYW55IHsgcmV0dXJuIHRoaXMuX29yaWdpbmFsRXhjZXB0aW9uOyB9XG5cbiAgZ2V0IG9yaWdpbmFsU3RhY2soKTogYW55IHsgcmV0dXJuIHRoaXMuX29yaWdpbmFsU3RhY2s7IH1cblxuXG4gIGdldCBjb250ZXh0KCk6IGFueSB7IHJldHVybiB0aGlzLl9jb250ZXh0OyB9XG5cbiAgZ2V0IG1lc3NhZ2UoKTogc3RyaW5nIHsgcmV0dXJuIEV4Y2VwdGlvbkhhbmRsZXIuZXhjZXB0aW9uVG9TdHJpbmcodGhpcyk7IH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5tZXNzYWdlOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlVHlwZUVycm9yKG1lc3NhZ2U/OiBzdHJpbmcpOiBFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKG1lc3NhZ2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5pbXBsZW1lbnRlZCgpOiBhbnkge1xuICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbigndW5pbXBsZW1lbnRlZCcpO1xufVxuIl19
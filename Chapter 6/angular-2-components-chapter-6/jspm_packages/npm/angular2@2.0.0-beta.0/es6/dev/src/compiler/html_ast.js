/* */ 
"format cjs";
import { isPresent } from 'angular2/src/facade/lang';
export class HtmlTextAst {
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) { return visitor.visitText(this, context); }
}
export class HtmlAttrAst {
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) { return visitor.visitAttr(this, context); }
}
export class HtmlElementAst {
    constructor(name, attrs, children, sourceSpan) {
        this.name = name;
        this.attrs = attrs;
        this.children = children;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) { return visitor.visitElement(this, context); }
}
export function htmlVisitAll(visitor, asts, context = null) {
    var result = [];
    asts.forEach(ast => {
        var astResult = ast.visit(visitor, context);
        if (isPresent(astResult)) {
            result.push(astResult);
        }
    });
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvY29tcGlsZXIvaHRtbF9hc3QudHMiXSwibmFtZXMiOlsiSHRtbFRleHRBc3QiLCJIdG1sVGV4dEFzdC5jb25zdHJ1Y3RvciIsIkh0bWxUZXh0QXN0LnZpc2l0IiwiSHRtbEF0dHJBc3QiLCJIdG1sQXR0ckFzdC5jb25zdHJ1Y3RvciIsIkh0bWxBdHRyQXN0LnZpc2l0IiwiSHRtbEVsZW1lbnRBc3QiLCJIdG1sRWxlbWVudEFzdC5jb25zdHJ1Y3RvciIsIkh0bWxFbGVtZW50QXN0LnZpc2l0IiwiaHRtbFZpc2l0QWxsIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQjtBQVNsRDtJQUNFQSxZQUFtQkEsS0FBYUEsRUFBU0EsVUFBMkJBO1FBQWpEQyxVQUFLQSxHQUFMQSxLQUFLQSxDQUFRQTtRQUFTQSxlQUFVQSxHQUFWQSxVQUFVQSxDQUFpQkE7SUFBR0EsQ0FBQ0E7SUFDeEVELEtBQUtBLENBQUNBLE9BQXVCQSxFQUFFQSxPQUFZQSxJQUFTRSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUNoR0YsQ0FBQ0E7QUFFRDtJQUNFRyxZQUFtQkEsSUFBWUEsRUFBU0EsS0FBYUEsRUFBU0EsVUFBMkJBO1FBQXRFQyxTQUFJQSxHQUFKQSxJQUFJQSxDQUFRQTtRQUFTQSxVQUFLQSxHQUFMQSxLQUFLQSxDQUFRQTtRQUFTQSxlQUFVQSxHQUFWQSxVQUFVQSxDQUFpQkE7SUFBR0EsQ0FBQ0E7SUFDN0ZELEtBQUtBLENBQUNBLE9BQXVCQSxFQUFFQSxPQUFZQSxJQUFTRSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUNoR0YsQ0FBQ0E7QUFFRDtJQUNFRyxZQUFtQkEsSUFBWUEsRUFBU0EsS0FBb0JBLEVBQVNBLFFBQW1CQSxFQUNyRUEsVUFBMkJBO1FBRDNCQyxTQUFJQSxHQUFKQSxJQUFJQSxDQUFRQTtRQUFTQSxVQUFLQSxHQUFMQSxLQUFLQSxDQUFlQTtRQUFTQSxhQUFRQSxHQUFSQSxRQUFRQSxDQUFXQTtRQUNyRUEsZUFBVUEsR0FBVkEsVUFBVUEsQ0FBaUJBO0lBQUdBLENBQUNBO0lBQ2xERCxLQUFLQSxDQUFDQSxPQUF1QkEsRUFBRUEsT0FBWUEsSUFBU0UsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDbkdGLENBQUNBO0FBUUQsNkJBQTZCLE9BQXVCLEVBQUUsSUFBZSxFQUFFLE9BQU8sR0FBUSxJQUFJO0lBQ3hGRyxJQUFJQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtJQUNoQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0E7UUFDZEEsSUFBSUEsU0FBU0EsR0FBR0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3pCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7SUFDSEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDSEEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7QUFDaEJBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFufSBmcm9tICcuL3BhcnNlX3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEh0bWxBc3Qge1xuICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW47XG4gIHZpc2l0KHZpc2l0b3I6IEh0bWxBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBIdG1sVGV4dEFzdCBpbXBsZW1lbnRzIEh0bWxBc3Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IHN0cmluZywgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogSHRtbEFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dCh0aGlzLCBjb250ZXh0KTsgfVxufVxuXG5leHBvcnQgY2xhc3MgSHRtbEF0dHJBc3QgaW1wbGVtZW50cyBIdG1sQXN0IHtcbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHZhbHVlOiBzdHJpbmcsIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG4gIHZpc2l0KHZpc2l0b3I6IEh0bWxBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdEF0dHIodGhpcywgY29udGV4dCk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIEh0bWxFbGVtZW50QXN0IGltcGxlbWVudHMgSHRtbEFzdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBhdHRyczogSHRtbEF0dHJBc3RbXSwgcHVibGljIGNoaWxkcmVuOiBIdG1sQXN0W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG4gIHZpc2l0KHZpc2l0b3I6IEh0bWxBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnQodGhpcywgY29udGV4dCk7IH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBIdG1sQXN0VmlzaXRvciB7XG4gIHZpc2l0RWxlbWVudChhc3Q6IEh0bWxFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0QXR0cihhc3Q6IEh0bWxBdHRyQXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0VGV4dChhc3Q6IEh0bWxUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodG1sVmlzaXRBbGwodmlzaXRvcjogSHRtbEFzdFZpc2l0b3IsIGFzdHM6IEh0bWxBc3RbXSwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueVtdIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBhc3RzLmZvckVhY2goYXN0ID0+IHtcbiAgICB2YXIgYXN0UmVzdWx0ID0gYXN0LnZpc2l0KHZpc2l0b3IsIGNvbnRleHQpO1xuICAgIGlmIChpc1ByZXNlbnQoYXN0UmVzdWx0KSkge1xuICAgICAgcmVzdWx0LnB1c2goYXN0UmVzdWx0KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19
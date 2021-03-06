/* */ 
"format cjs";
export const EVENT_TARGET_SEPARATOR = ':';
export class EventConfig {
    constructor(fieldName, eventName, isLongForm) {
        this.fieldName = fieldName;
        this.eventName = eventName;
        this.isLongForm = isLongForm;
    }
    static parse(eventConfig) {
        var fieldName = eventConfig, eventName = eventConfig, isLongForm = false;
        var separatorIdx = eventConfig.indexOf(EVENT_TARGET_SEPARATOR);
        if (separatorIdx > -1) {
            // long format: 'fieldName: eventName'
            fieldName = eventConfig.substring(0, separatorIdx).trim();
            eventName = eventConfig.substring(separatorIdx + 1).trim();
            isLongForm = true;
        }
        return new EventConfig(fieldName, eventName, isLongForm);
    }
    getFullName() {
        return this.isLongForm ? `${this.fieldName}${EVENT_TARGET_SEPARATOR}${this.eventName}` :
            this.eventName;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2V2ZW50X2NvbmZpZy50cyJdLCJuYW1lcyI6WyJFdmVudENvbmZpZyIsIkV2ZW50Q29uZmlnLmNvbnN0cnVjdG9yIiwiRXZlbnRDb25maWcucGFyc2UiLCJFdmVudENvbmZpZy5nZXRGdWxsTmFtZSJdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYSxzQkFBc0IsR0FBRyxHQUFHLENBQUM7QUFFMUM7SUFDRUEsWUFBbUJBLFNBQWlCQSxFQUFTQSxTQUFpQkEsRUFBU0EsVUFBbUJBO1FBQXZFQyxjQUFTQSxHQUFUQSxTQUFTQSxDQUFRQTtRQUFTQSxjQUFTQSxHQUFUQSxTQUFTQSxDQUFRQTtRQUFTQSxlQUFVQSxHQUFWQSxVQUFVQSxDQUFTQTtJQUFHQSxDQUFDQTtJQUU5RkQsT0FBT0EsS0FBS0EsQ0FBQ0EsV0FBbUJBO1FBQzlCRSxJQUFJQSxTQUFTQSxHQUFHQSxXQUFXQSxFQUFFQSxTQUFTQSxHQUFHQSxXQUFXQSxFQUFFQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUN6RUEsSUFBSUEsWUFBWUEsR0FBR0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxDQUFDQTtRQUMvREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdEJBLHNDQUFzQ0E7WUFDdENBLFNBQVNBLEdBQUdBLFdBQVdBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO1lBQzFEQSxTQUFTQSxHQUFHQSxXQUFXQSxDQUFDQSxTQUFTQSxDQUFDQSxZQUFZQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUMzREEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDcEJBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLElBQUlBLFdBQVdBLENBQUNBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO0lBQzNEQSxDQUFDQTtJQUVERixXQUFXQTtRQUNURyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxzQkFBc0JBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBO1lBQzdEQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7QUFDSEgsQ0FBQ0E7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBFVkVOVF9UQVJHRVRfU0VQQVJBVE9SID0gJzonO1xuXG5leHBvcnQgY2xhc3MgRXZlbnRDb25maWcge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmllbGROYW1lOiBzdHJpbmcsIHB1YmxpYyBldmVudE5hbWU6IHN0cmluZywgcHVibGljIGlzTG9uZ0Zvcm06IGJvb2xlYW4pIHt9XG5cbiAgc3RhdGljIHBhcnNlKGV2ZW50Q29uZmlnOiBzdHJpbmcpOiBFdmVudENvbmZpZyB7XG4gICAgdmFyIGZpZWxkTmFtZSA9IGV2ZW50Q29uZmlnLCBldmVudE5hbWUgPSBldmVudENvbmZpZywgaXNMb25nRm9ybSA9IGZhbHNlO1xuICAgIHZhciBzZXBhcmF0b3JJZHggPSBldmVudENvbmZpZy5pbmRleE9mKEVWRU5UX1RBUkdFVF9TRVBBUkFUT1IpO1xuICAgIGlmIChzZXBhcmF0b3JJZHggPiAtMSkge1xuICAgICAgLy8gbG9uZyBmb3JtYXQ6ICdmaWVsZE5hbWU6IGV2ZW50TmFtZSdcbiAgICAgIGZpZWxkTmFtZSA9IGV2ZW50Q29uZmlnLnN1YnN0cmluZygwLCBzZXBhcmF0b3JJZHgpLnRyaW0oKTtcbiAgICAgIGV2ZW50TmFtZSA9IGV2ZW50Q29uZmlnLnN1YnN0cmluZyhzZXBhcmF0b3JJZHggKyAxKS50cmltKCk7XG4gICAgICBpc0xvbmdGb3JtID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBFdmVudENvbmZpZyhmaWVsZE5hbWUsIGV2ZW50TmFtZSwgaXNMb25nRm9ybSk7XG4gIH1cblxuICBnZXRGdWxsTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmlzTG9uZ0Zvcm0gPyBgJHt0aGlzLmZpZWxkTmFtZX0ke0VWRU5UX1RBUkdFVF9TRVBBUkFUT1J9JHt0aGlzLmV2ZW50TmFtZX1gIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudE5hbWU7XG4gIH1cbn1cbiJdfQ==
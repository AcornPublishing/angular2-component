<a name="5.0.0-beta.0"></a>
# [5.0.0-beta.0](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.14...v5.0.0-beta.0) (2015-12-15)


### Bug Fixes

* **micro-perf:** rename immediate to queue scheduler ([fe56b28](https://github.com/ReactiveX/RxJS/commit/fe56b28)), closes [#1040](https://github.com/ReactiveX/RxJS/issues/1040)
* **micro-perf:** use the correnct scheduler on current-thread tests ([3dff5eb](https://github.com/ReactiveX/RxJS/commit/3dff5eb))
* **operators:** emit declarations for patch modules ([676f82d](https://github.com/ReactiveX/RxJS/commit/676f82d))
* **test:** make explicit unsubscription for observable ([7f67b09](https://github.com/ReactiveX/RxJS/commit/7f67b09))
* **test:** make explicit unsubscription for observable ([65e65e2](https://github.com/ReactiveX/RxJS/commit/65e65e2))
* **window:** fix window() to dispose window Subjects ([5168f73](https://github.com/ReactiveX/RxJS/commit/5168f73))
* **windowCount:** fix windowCount to dispose window Subjects ([f29ee29](https://github.com/ReactiveX/RxJS/commit/f29ee29))
* **windowTime:** fix windowTime to dispose window Subjects ([b73e260](https://github.com/ReactiveX/RxJS/commit/b73e260))
* **windowToggle:** fix windowToggle to dispose window Subjects ([15ff3f7](https://github.com/ReactiveX/RxJS/commit/15ff3f7))
* **windowWhen:** fix windowWhen to dispose window Subjects ([91c1941](https://github.com/ReactiveX/RxJS/commit/91c1941))

### Features

* **inspect:** added inspect operator ([f9944ae](https://github.com/ReactiveX/RxJS/commit/f9944ae))
* **inspectTime:** add inspectTime operator ([6835dcd](https://github.com/ReactiveX/RxJS/commit/6835dcd))
* **sample:** readd `sample` operator ([e93bffc](https://github.com/ReactiveX/RxJS/commit/e93bffc))
* **sampleTime:** reimplement `sampleTime` with RxJS 4 behavior ([6b77e69](https://github.com/ReactiveX/RxJS/commit/6b77e69))
* **TestScheduler:** add createTime() parser to return number ([cb8cf6b](https://github.com/ReactiveX/RxJS/commit/cb8cf6b))


### BREAKING CHANGES

* sampleTime: `sampleTime` now has the same behavior `sample(number, scheduler)` did in RxJS 4
* sample: `sample` behavior returned to RxJS 4 behavior
* inspectTime: `sampleTime` is now `inspectTime`
* inspect: RxJS 5 `sample` behavior is now `inspect`
* extended operators: All extended operators are now under the same operator directory as all others. This means that
  `import "rxjs/add/operator/extended/min"` is now `import "rxjs/add/operator/min"`



<a name="5.0.0-alpha.14"></a>
# [5.0.0-alpha.14](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.13...v5.0.0-alpha.14) (2015-12-09)


### Bug Fixes

* **every:** handle thisArg for scalar and array observables ([eae4b00](https://github.com/ReactiveX/RxJS/commit/eae4b00))
* **SymbolShim:** ensure for function even if Symbol already exists ([e942776](https://github.com/ReactiveX/RxJS/commit/e942776)), closes [#999](https://github.com/ReactiveX/RxJS/issues/999)
* **SymbolShim:** Symbol polyfill is a function ([1f57157](https://github.com/ReactiveX/RxJS/commit/1f57157)), closes [#988](https://github.com/ReactiveX/RxJS/issues/988)
* **timeoutWith:** fix to avoid unnecessary inner subscription ([6e63752](https://github.com/ReactiveX/RxJS/commit/6e63752))

### Features

* **count:** remove thisArg ([878a1fd](https://github.com/ReactiveX/RxJS/commit/878a1fd))
* **distinctUntilChanged:** remove thisArg ([bfc52d6](https://github.com/ReactiveX/RxJS/commit/bfc52d6))
* **exhaust:** rename switchFirst operators to exhaust ([9b565c9](https://github.com/ReactiveX/RxJS/commit/9b565c9)), closes [#915](https://github.com/ReactiveX/RxJS/issues/915)
* **finally:** remove thisArg ([d4b02fc](https://github.com/ReactiveX/RxJS/commit/d4b02fc))
* **forEach:** add thisArg ([14ffce6](https://github.com/ReactiveX/RxJS/commit/14ffce6)), closes [#878](https://github.com/ReactiveX/RxJS/issues/878)
* **single:** remove thisArg ([43af805](https://github.com/ReactiveX/RxJS/commit/43af805))


### BREAKING CHANGES

* exhaust: switchFirst is now exhaust
* exhaust: switchFirstMap is now exhaustMap
* forEach: Observable.prototype.forEach argument order changed to accommodate thisArg. Optional PromiseCtor argument moved to third arg from second



<a name="5.0.0-alpha.13"></a>
# [5.0.0-alpha.13](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.12...v5.0.0-alpha.13) (2015-12-08)


### Bug Fixes

* **Observable:** fix circular dependency issue. ([b7672f4](https://github.com/ReactiveX/RxJS/commit/b7672f4))
* **bufferToggle:** fix unsubscriptions of closing Observable ([439b641](https://github.com/ReactiveX/RxJS/commit/439b641))
* **expand:** accept scheduler parameter ([79e9084](https://github.com/ReactiveX/RxJS/commit/79e9084)), closes [#841](https://github.com/ReactiveX/RxJS/issues/841)
* **publish:** make script generate correct package names ([10563d3](https://github.com/ReactiveX/RxJS/commit/10563d3))
* **repeat:** preserve Subscriber chain in repeat() ([d9a7328](https://github.com/ReactiveX/RxJS/commit/d9a7328))
* **retry:** preserve Subscriber chain in retry() ([b429dac](https://github.com/ReactiveX/RxJS/commit/b429dac))
* **retryWhen:** preserve Subscriber chain in retryWhen() ([c9cb958](https://github.com/ReactiveX/RxJS/commit/c9cb958))

### Features

* **AsapScheduler:** rename NextTickScheduler to AsapScheduler ([3255fb3](https://github.com/ReactiveX/RxJS/commit/3255fb3)), closes [#838](https://github.com/ReactiveX/RxJS/issues/838)
* **BehaviorSubject:** add getValue method to access value ([33b387b](https://github.com/ReactiveX/RxJS/commit/33b387b)), closes [#758](https://github.com/ReactiveX/RxJS/issues/758)
* **BehaviorSubject:** now throws when getValue is called after unsubscription ([1ddf116](https://github.com/ReactiveX/RxJS/commit/1ddf116))
* **ObjectUnsubscribedError:** add ObjectUnsubscribed error class ([39836af](https://github.com/ReactiveX/RxJS/commit/39836af))
* **Observable:** subscribe accepts objects with rxSubscriber symbol ([b7672f4](https://github.com/ReactiveX/RxJS/commit/b7672f4))
* **QueueScheduler:** rename ImmediateScheduler to QueueScheduler ([66eb537](https://github.com/ReactiveX/RxJS/commit/66eb537))
* **Rx.Symbol.rxSubscriber:** add rxSubscriber symbol ([d4f1670](https://github.com/ReactiveX/RxJS/commit/d4f1670))
* **Subject:** add rxSubscriber symbol ([d2e4257](https://github.com/ReactiveX/RxJS/commit/d2e4257))
* **Subscriber:** add rxSubscriber symbol ([7bda360](https://github.com/ReactiveX/RxJS/commit/7bda360))
* **switchFirstMap:** rename switchMapFirst to switchFirstMap ([eddd4dc](https://github.com/ReactiveX/RxJS/commit/eddd4dc))


### BREAKING CHANGES

* AsapScheduler: `Rx.Scheduler.nextTick` (Rx 4's "default" scheduler) is now `Rx.Scheduler.asap`
* QueueScheduler: `Rx.Scheduler.immediate` (Rx 4's "currentThread" scheduler) is now `Rx.Scheduler.queue`
related #838
* switchFirstMap: `switchMapFirst` is now `switchFirstMap`



<a name="5.0.0-alpha.12"></a>
# [5.0.0-alpha.12](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.10...v5.0.0-alpha.12) (2015-12-04)


### Bug Fixes

* **AsyncSubject:** emit value when it's subscribed after complete ([ed0eaf6](https://github.com/ReactiveX/RxJS/commit/ed0eaf6))
* **bindCallback:** only call function once even while scheduled ([8637d47](https://github.com/ReactiveX/RxJS/commit/8637d47)), closes [#881](https://github.com/ReactiveX/RxJS/issues/881)
* **bufferToggle:** fix disposal of subscriptions when errors occur ([a20325c](https://github.com/ReactiveX/RxJS/commit/a20325c))
* **catch:** fix catch to dispose old subscriptions ([280f7ed](https://github.com/ReactiveX/RxJS/commit/280f7ed)), closes [#763](https://github.com/ReactiveX/RxJS/issues/763)
* **catch:** fix catch() to preserve Subscriber chain ([e1447ac](https://github.com/ReactiveX/RxJS/commit/e1447ac))
* **concat:** accept scheduler parameter ([8859702](https://github.com/ReactiveX/RxJS/commit/8859702))
* **ConnectableObservable:** fix ConnectableObservable connectability and refCounting ([aef9578](https://github.com/ReactiveX/RxJS/commit/aef9578)), closes [#678](https://github.com/ReactiveX/RxJS/issues/678)
* **debounce:** Fix debounce to unsubscribe duration Observables ([dea7847](https://github.com/ReactiveX/RxJS/commit/dea7847))
* **expand:** fix expand's concurrency behavior ([01f86e5](https://github.com/ReactiveX/RxJS/commit/01f86e5))
* **expand:** terminate recursive call when destination completes ([3b8cf94](https://github.com/ReactiveX/RxJS/commit/3b8cf94))
* **Observable:** Subjects no longer wrapped in Subscriber ([5cb0f2b](https://github.com/ReactiveX/RxJS/commit/5cb0f2b)), closes [#825](https://github.com/ReactiveX/RxJS/issues/825) [#748](https://github.com/ReactiveX/RxJS/issues/748)
* **Observer:** anonymous observers now allow missing handlers ([a11c763](https://github.com/ReactiveX/RxJS/commit/a11c763)), closes [#723](https://github.com/ReactiveX/RxJS/issues/723)
* **operators:** Remove shareReplay and shareBehavior ([536a6a6](https://github.com/ReactiveX/RxJS/commit/536a6a6)), closes [#710](https://github.com/ReactiveX/RxJS/issues/710)
* **publish:** copy readme and license, remove scripts ([439a2f3](https://github.com/ReactiveX/RxJS/commit/439a2f3)), closes [#845](https://github.com/ReactiveX/RxJS/issues/845)
* **throttleTime:** fix and rename throttleTime operator ([3b0c1f3](https://github.com/ReactiveX/RxJS/commit/3b0c1f3))
* **TimerObservable:** accepts absolute date for dueTime ([e284fb8](https://github.com/ReactiveX/RxJS/commit/e284fb8)), closes [#648](https://github.com/ReactiveX/RxJS/issues/648)

### Features

* **AsyncSubject:** add AsyncSubject ([34c05fe](https://github.com/ReactiveX/RxJS/commit/34c05fe))
* **bindCallback:** remove thisArg ([feea9a1](https://github.com/ReactiveX/RxJS/commit/feea9a1))
* **bindCallback:** rename fromCallback to bindCallback ([305d66d](https://github.com/ReactiveX/RxJS/commit/305d66d)), closes [#876](https://github.com/ReactiveX/RxJS/issues/876)
* **callback:** Add Observable.fromCallback ([9f751e7](https://github.com/ReactiveX/RxJS/commit/9f751e7))
* **combineLatest:** accept array of observable as parameter ([2edd92c](https://github.com/ReactiveX/RxJS/commit/2edd92c)), closes [#594](https://github.com/ReactiveX/RxJS/issues/594)
* **forkJoin:** accept array of observable as parameter ([d45f672](https://github.com/ReactiveX/RxJS/commit/d45f672))
* **mergeScan:** support concurrency parameter for mergeScan ([fe0eb37](https://github.com/ReactiveX/RxJS/commit/fe0eb37)), closes [#868](https://github.com/ReactiveX/RxJS/issues/868)
* **usage:** add auto-patching operators ([1ab3508](https://github.com/ReactiveX/RxJS/commit/1ab3508)), closes [#860](https://github.com/ReactiveX/RxJS/issues/860)
* **skipWhile:** add skipWhile operator ([a2244e0](https://github.com/ReactiveX/RxJS/commit/a2244e0))
* **switchFirst:** add switchFirst and switchMapFirst ([71e3dd1](https://github.com/ReactiveX/RxJS/commit/71e3dd1))
* **publishLast:** add publishLast operator ([9bef228](https://github.com/ReactiveX/RxJS/commit/9bef228)), closes [#883](https://github.com/ReactiveX/RxJS/issues/883)
* **takeWhile:** add takeWhile operator ([48e53ea](https://github.com/ReactiveX/RxJS/commit/48e53ea)), closes [#695](https://github.com/ReactiveX/RxJS/issues/695)
* **takeWhile:** remove thisArg ([b5219a4](https://github.com/ReactiveX/RxJS/commit/b5219a4))
* **throttle:** add throttle operator with durationSelector ([c3bf3e7](https://github.com/ReactiveX/RxJS/commit/c3bf3e7)), closes [#496](https://github.com/ReactiveX/RxJS/issues/496)

### Performance Improvements

* **ReplaySubject:** fix memory leak of growing buffer ([0a73b4d](https://github.com/ReactiveX/RxJS/commit/0a73b4d)), closes [#578](https://github.com/ReactiveX/RxJS/issues/578)



<a name="5.0.0-alpha.11"></a>
# [5.0.0-alpha.11](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.10...v5.0.0-alpha.11) (2015-12-01)


### Bug Fixes

* **catch:** fix catch to dispose old subscriptions ([280f7ed](https://github.com/ReactiveX/RxJS/commit/280f7ed)), closes [#763](https://github.com/ReactiveX/RxJS/issues/763)
* **concat:** accept scheduler parameter ([8859702](https://github.com/ReactiveX/RxJS/commit/8859702))
* **ConnectableObservable:** fix ConnectableObservable connectability and refCounting ([aef9578](https://github.com/ReactiveX/RxJS/commit/aef9578)), closes [#678](https://github.com/ReactiveX/RxJS/issues/678)
* **debounce:** Fix debounce to unsubscribe duration Observables ([dea7847](https://github.com/ReactiveX/RxJS/commit/dea7847))
* **expand:** fix expand's concurrency behavior ([01f86e5](https://github.com/ReactiveX/RxJS/commit/01f86e5))
* **expand:** terminate recursive call when destination completes ([3b8cf94](https://github.com/ReactiveX/RxJS/commit/3b8cf94))
* **Observer:** anonymous observers now allow missing handlers ([a11c763](https://github.com/ReactiveX/RxJS/commit/a11c763)), closes [#723](https://github.com/ReactiveX/RxJS/issues/723)
* **operators:** Remove shareReplay and shareBehavior ([536a6a6](https://github.com/ReactiveX/RxJS/commit/536a6a6)), closes [#710](https://github.com/ReactiveX/RxJS/issues/710)
* **test:** make explicit unsubscription for observable ([505f5b7](https://github.com/ReactiveX/RxJS/commit/505f5b7))
* **throttleTime:** fix and rename throttleTime operator ([3b0c1f3](https://github.com/ReactiveX/RxJS/commit/3b0c1f3))
* **TimerObservable:** accepts absolute date for dueTime ([e284fb8](https://github.com/ReactiveX/RxJS/commit/e284fb8)), closes [#648](https://github.com/ReactiveX/RxJS/issues/648)

### Features

* **callback:** Add Observable.fromCallback ([9f751e7](https://github.com/ReactiveX/RxJS/commit/9f751e7))
* **combineLatest:** accept array of observable as parameter ([2edd92c](https://github.com/ReactiveX/RxJS/commit/2edd92c)), closes [#594](https://github.com/ReactiveX/RxJS/issues/594)
* **forkJoin:** accept array of observable as parameter ([d45f672](https://github.com/ReactiveX/RxJS/commit/d45f672))
* **operator:** add skipWhile operator ([a2244e0](https://github.com/ReactiveX/RxJS/commit/a2244e0))
* **operator:** add switchFirst and switchMapFirst ([71e3dd1](https://github.com/ReactiveX/RxJS/commit/71e3dd1))
* **takeWhile:** add takeWhile operator ([48e53ea](https://github.com/ReactiveX/RxJS/commit/48e53ea)), closes [#695](https://github.com/ReactiveX/RxJS/issues/695)
* **throttle:** add throttle operator with durationSelector ([c3bf3e7](https://github.com/ReactiveX/RxJS/commit/c3bf3e7)), closes [#496](https://github.com/ReactiveX/RxJS/issues/496)

### Performance Improvements

* **ReplaySubject:** fix memory leak of growing buffer ([0a73b4d](https://github.com/ReactiveX/RxJS/commit/0a73b4d)), closes [#578](https://github.com/ReactiveX/RxJS/issues/578)



<a name="5.0.0-alpha.10"></a>
# [5.0.0-alpha.10](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.9...v5.0.0-alpha.10) (2015-11-10)


### Bug Fixes

* **Immediate:** set immediate should no longer throw in Chrome ([a3de7d9](https://github.com/ReactiveX/RxJS/commit/a3de7d9)), closes [#690](https://github.com/ReactiveX/RxJS/issues/690)



<a name="5.0.0-alpha.9"></a>
# [5.0.0-alpha.9](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.8...v5.0.0-alpha.9) (2015-11-10)


### Bug Fixes

* **util:** incorrect Symbol.iterator for es6-shim ([15bf32c](https://github.com/ReactiveX/RxJS/commit/15bf32c))

### Features

* **forkJoin:** accept promise, resultselector as parameter of forkJoin ([190f349](https://github.com/ReactiveX/RxJS/commit/190f349)), closes [#507](https://github.com/ReactiveX/RxJS/issues/507)



<a name="5.0.0-alpha.8"></a>
# [5.0.0-alpha.8](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.7...v5.0.0-alpha.8) (2015-11-06)


### Bug Fixes

* **concat:** handle a given scheduler correctly ([8745216](https://github.com/ReactiveX/RxJS/commit/8745216))
* **package.json:** loosen the engines/npm semver range to prevent false warnings ([df791c6](https://github.com/ReactiveX/RxJS/commit/df791c6))
* **skipUntil:** unsubscribe source when it completes ([8a4162b](https://github.com/ReactiveX/RxJS/commit/8a4162b)), closes [#577](https://github.com/ReactiveX/RxJS/issues/577)
* **take:** deal with total <= 0 and add tests ([c5cc06f](https://github.com/ReactiveX/RxJS/commit/c5cc06f))
* **windowWhen:** fix windowWhen with regard to unsubscriptions ([8174947](https://github.com/ReactiveX/RxJS/commit/8174947))

### Features

* **mergeScan:** add new mergeScan operator. ([0ebb5bd](https://github.com/ReactiveX/RxJS/commit/0ebb5bd))
* **multicast:** support both Subject and subjectFactory arguments ([f779027](https://github.com/ReactiveX/RxJS/commit/f779027))

### BREAKING CHANGES

* **publish:** reverted to RxJS 4 behavior
* **publishBehavior:** reverted to RxJS 4 behavior
* **publishReplay:** reverted to RxJS 4 behavior
* **shareBehavior:** removed
* **shareReplay:** removed

<a name="5.0.0-alpha.7"></a>
# [5.0.0-alpha.7](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.6...v5.0.0-alpha.7) (2015-10-27)


### Bug Fixes

* **NextTickAction:** fix unsubscription behavior ([3d8264c](https://github.com/ReactiveX/RxJS/commit/3d8264c)), closes [#582](https://github.com/ReactiveX/RxJS/issues/582)
* **buffer:** cleanup notifier subscription when unsubscribed ([1b30aa9](https://github.com/ReactiveX/RxJS/commit/1b30aa9))
* **delay:** accepts absolute time delay ([b109100](https://github.com/ReactiveX/RxJS/commit/b109100))
* **mergeMapTo:** mergeMapTo result should complete ([6f9859e](https://github.com/ReactiveX/RxJS/commit/6f9859e))
* **operator:** update type definitions for union types ([9d90c75](https://github.com/ReactiveX/RxJS/commit/9d90c75)), closes [#581](https://github.com/ReactiveX/RxJS/issues/581)
* **repeat:** fix inner subscription semantics for repeat ([f67a596](https://github.com/ReactiveX/RxJS/commit/f67a596)), closes [#554](https://github.com/ReactiveX/RxJS/issues/554)
* **switchMapTo:** reimplement switchMapTo to pass tests ([d4789cd](https://github.com/ReactiveX/RxJS/commit/d4789cd))
* **takeUntil:** unsubscribe notifier when it completes ([9415196](https://github.com/ReactiveX/RxJS/commit/9415196))

### Features

* **operator:** add max operator ([7fda036](https://github.com/ReactiveX/RxJS/commit/7fda036))
* **operator:** add min operator ([79cb6cf](https://github.com/ReactiveX/RxJS/commit/79cb6cf))
* **shareBehavior:** add shareBehavior and its tests ([97ff1ec](https://github.com/ReactiveX/RxJS/commit/97ff1ec))



<a name="5.0.0-alpha.6"></a>
# [5.0.0-alpha.6](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.5...v5.0.0-alpha.6) (2015-10-17)


### Bug Fixes

* **retryWhen:** fix internal unsubscriptions ([5aff5e8](https://github.com/ReactiveX/RxJS/commit/5aff5e8))
* **scan:** scan now behaves like RxJS 4 scan ([27f9c09](https://github.com/ReactiveX/RxJS/commit/27f9c09))



<a name="5.0.0-alpha.5"></a>
# [5.0.0-alpha.5](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.4...v5.0.0-alpha.5) (2015-10-16)


### Bug Fixes

* **bufferToggle:** fix bugs in order to pass tests ([949fa31](https://github.com/ReactiveX/RxJS/commit/949fa31))
* **mergeAll:** fix mergeAll micro performance tests to use mapTo instead of map. ([616e86e](https://github.com/ReactiveX/RxJS/commit/616e86e))
* **package:** correct typings path ([a501b06](https://github.com/ReactiveX/RxJS/commit/a501b06))
* **repeat:** add additional resubscription behavior ([4f9f33b](https://github.com/ReactiveX/RxJS/commit/4f9f33b)), closes [#516](https://github.com/ReactiveX/RxJS/issues/516)
* **retry:** fix internal unsubscriptions for retry ([cc92f45](https://github.com/ReactiveX/RxJS/commit/cc92f45)), closes [#546](https://github.com/ReactiveX/RxJS/issues/546)
* **windowToggle:** fix window closing and unsubscription semantics ([0cb21e6](https://github.com/ReactiveX/RxJS/commit/0cb21e6))



<a name="5.0.0-alpha.4"></a>
# [5.0.0-alpha.4](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.3...5.0.0-alpha.4) (2015-10-15)


### Bug Fixes

* **Subject:** fix missing unsubscribe call ([9dd27d6](https://github.com/ReactiveX/RxJS/commit/9dd27d6))
* **Subscriber:** avoid implicit any ([08faaa9](https://github.com/ReactiveX/RxJS/commit/08faaa9))
* **bufferWhen:** onComplete of closings determine buffers ([5d28a38](https://github.com/ReactiveX/RxJS/commit/5d28a38))
* **fromEvent:** make selector argument optional in fromEvent static method ([71d90b4](https://github.com/ReactiveX/RxJS/commit/71d90b4))
* **skipUntil:** update skipUntil behavior with error, completion ([6f0d98f](https://github.com/ReactiveX/RxJS/commit/6f0d98f)), closes [#518](https://github.com/ReactiveX/RxJS/issues/518)
* **windowCount:** fix windowCount window opening times ([908ae56](https://github.com/ReactiveX/RxJS/commit/908ae56)), closes [#273](https://github.com/ReactiveX/RxJS/issues/273)

### Features

* **operator:** add debounce operator ([a1e652f](https://github.com/ReactiveX/RxJS/commit/a1e652f)), closes [#493](https://github.com/ReactiveX/RxJS/issues/493)
* **operator:** add debounceTime operator ([dd2ba40](https://github.com/ReactiveX/RxJS/commit/dd2ba40))

### Performance Improvements

* **ScalarObservable:** add fast-path for mapping scalar observables ([7b0d3dc](https://github.com/ReactiveX/RxJS/commit/7b0d3dc))
* **count:** fast-path for counting over scalars ([c35a120](https://github.com/ReactiveX/RxJS/commit/c35a120))
* **filter:** add fast-path for filtering scalar observables ([e2e8954](https://github.com/ReactiveX/RxJS/commit/e2e8954))
* **reduce:** add fast-path for reducing over scalar observables ([4c65136](https://github.com/ReactiveX/RxJS/commit/4c65136))
* **scan:** fast-path for scanning scalars ([0201b92](https://github.com/ReactiveX/RxJS/commit/0201b92))
* **skip:** fast-path for skip over scalar observable ([9b49936](https://github.com/ReactiveX/RxJS/commit/9b49936))
* **take:** add fast-path for take over scalars ([33053b1](https://github.com/ReactiveX/RxJS/commit/33053b1))



<a name="5.0.0-alpha.3"></a>
# [5.0.0-alpha.3](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.2...5.0.0-alpha.3) (2015-10-13)


### Bug Fixes

* **Observable:** fix type signature of some static operators ([e5364de](https://github.com/ReactiveX/RxJS/commit/e5364de))
* **Subject.create:** ensure operator property not required for Observable subscription ([2259de2](https://github.com/ReactiveX/RxJS/commit/2259de2)), closes [#483](https://github.com/ReactiveX/RxJS/issues/483)
* **TestScheduler:** stop sorting actual results ([51db0b8](https://github.com/ReactiveX/RxJS/commit/51db0b8)), closes [#422](https://github.com/ReactiveX/RxJS/issues/422)
* **benchpress:** update benchpress dependencies and config ([8513eaa](https://github.com/ReactiveX/RxJS/commit/8513eaa)), closes [#348](https://github.com/ReactiveX/RxJS/issues/348)
* **buffer:** change behavior of buffer to more closely match RxJS 4 ([b66592d](https://github.com/ReactiveX/RxJS/commit/b66592d))
* **combineLatest:** fix type signature ([a3e6deb](https://github.com/ReactiveX/RxJS/commit/a3e6deb))
* **defer:** fix type signature ([11327b9](https://github.com/ReactiveX/RxJS/commit/11327b9))
* **empty:** fix type signature ([893cb7e](https://github.com/ReactiveX/RxJS/commit/893cb7e))
* **fromPromise:** fix type signature ([17415fa](https://github.com/ReactiveX/RxJS/commit/17415fa))
* **groupBy:** durationSelector cannot keep source alive ([57e4207](https://github.com/ReactiveX/RxJS/commit/57e4207))
* **groupBy:** fix bugs related to group resets ([23a7574](https://github.com/ReactiveX/RxJS/commit/23a7574))
* **groupBy:** fix bugs with groupBy ([86992c6](https://github.com/ReactiveX/RxJS/commit/86992c6))
* **interval:** fix signature type ([9c238c0](https://github.com/ReactiveX/RxJS/commit/9c238c0))
* **operator:** startWith operator accepts scheduler, multiple values ([d1d339a](https://github.com/ReactiveX/RxJS/commit/d1d339a))
* **operators:** reorder signature of resultSelectors ([fc1724d](https://github.com/ReactiveX/RxJS/commit/fc1724d))
* **range:** fix type signature ([9237d0b](https://github.com/ReactiveX/RxJS/commit/9237d0b))
* **timeout:** fix absolute timeout behavior ([8ec06cf](https://github.com/ReactiveX/RxJS/commit/8ec06cf))
* **timeout:** update behavior of timeout, timeoutWith ([16bd691](https://github.com/ReactiveX/RxJS/commit/16bd691))
* **timer:** fix type signature ([fffb96c](https://github.com/ReactiveX/RxJS/commit/fffb96c))
* **window:** handle closingNotifier errors/completes ([42beff1](https://github.com/ReactiveX/RxJS/commit/42beff1))

### Features

* **TestScheduler:** support unsubscription marbles ([ffb0bb9](https://github.com/ReactiveX/RxJS/commit/ffb0bb9))
* **count:** add predicate support in count() ([42d1add](https://github.com/ReactiveX/RxJS/commit/42d1add)), closes [#425](https://github.com/ReactiveX/RxJS/issues/425)
* **dematerialize:** add dematerialize operator ([0a8b074](https://github.com/ReactiveX/RxJS/commit/0a8b074)), closes [#475](https://github.com/ReactiveX/RxJS/issues/475)
* **do:** do will now handle an observer as an argument ([c1a4994](https://github.com/ReactiveX/RxJS/commit/c1a4994)), closes [#476](https://github.com/ReactiveX/RxJS/issues/476)
* **first:** add resultSelector ([3c20fcc](https://github.com/ReactiveX/RxJS/commit/3c20fcc)), closes [#417](https://github.com/ReactiveX/RxJS/issues/417)
* **last:** add resultSelector argument ([5a4896c](https://github.com/ReactiveX/RxJS/commit/5a4896c)), closes [#418](https://github.com/ReactiveX/RxJS/issues/418)
* **operator:** add every operator ([d11f32e](https://github.com/ReactiveX/RxJS/commit/d11f32e))
* **operator:** add timeInterval operator ([6cc0615](https://github.com/ReactiveX/RxJS/commit/6cc0615))
* **share:** add the share operator ([c36f2be](https://github.com/ReactiveX/RxJS/commit/c36f2be)), closes [#439](https://github.com/ReactiveX/RxJS/issues/439)
* **shareReplay:** add the shareReplay() operator ([65c84ea](https://github.com/ReactiveX/RxJS/commit/65c84ea))

### Performance Improvements

* **ReplaySubject:** remove unnecessary computation ([488ac2e](https://github.com/ReactiveX/RxJS/commit/488ac2e))


### BREAKING CHANGES

* **operators with resultSelectors** (mergeMap, concatMap, switchMap, etc):
The function signature of resultSelectors used to be (innerValue,
outerValue, innerIndex, outerIndex) but this commits changes it to
be (outerValue, innerValue, outerIndex, innerIndex), to match
signatures in RxJS 4.


<a name="5.0.0-alpha.2"></a>
# [5.0.0-alpha.2](https://github.com/ReactiveX/RxJS/compare/5.0.0-alpha.1...5.0.0-alpha.2) (2015-09-30)


### Bug Fixes

* **concat:** let observable concat instead of merge ([c17e832](https://github.com/ReactiveX/RxJS/commit/c17e832))

### Features

* **operator:** add find, findIndex operator ([7c6cc9d](https://github.com/ReactiveX/RxJS/commit/7c6cc9d))
* **operator:** add first operator ([274c233](https://github.com/ReactiveX/RxJS/commit/274c233))
* **operator:** add ignoreElements operator ([fe1a952](https://github.com/ReactiveX/RxJS/commit/fe1a952))
* **zip:** zip now supports never-ending iterables ([a5684ba](https://github.com/ReactiveX/RxJS/commit/a5684ba)), closes [#397](https://github.com/ReactiveX/RxJS/issues/397)



<a name="5.0.0-alpha.1"></a>
# [5.0.0-alpha.1](https://github.com/ReactiveX/RxJS/compare/0.0.0-prealpha.3...5.0.0-alpha.1) (2015-09-23)


### Bug Fixes

* **Promises:** escape promise error trap ([c69088a](https://github.com/ReactiveX/RxJS/commit/c69088a))
* **TestScheduler:** ensure TestScheduler subscribes to expectations before hot subjects ([b9b2ba5](https://github.com/ReactiveX/RxJS/commit/b9b2ba5))
* **TestScheduler:** properly schedule actions added dynamically ([069ede4](https://github.com/ReactiveX/RxJS/commit/069ede4))
* **buffer:** do not emit empty buffer when completes ([252fccb](https://github.com/ReactiveX/RxJS/commit/252fccb))
* **bufferTime:** inner intervals will now clean up properly ([4ef41b0](https://github.com/ReactiveX/RxJS/commit/4ef41b0))
* **expand:** Fix expand to stay open until the source Observable completes. ([20ef785](https://github.com/ReactiveX/RxJS/commit/20ef785))
* **expand:** fix expand operator to match Rx3 ([67f9623](https://github.com/ReactiveX/RxJS/commit/67f9623))
* **last:** emit value matches with predicate instead of result of predicate ([0f635ee](https://github.com/ReactiveX/RxJS/commit/0f635ee))
* **merge:** fix issues with async in merge ([7a15304](https://github.com/ReactiveX/RxJS/commit/7a15304))
* **mergeAll:** merge all will properly handle async observables ([43b63cc](https://github.com/ReactiveX/RxJS/commit/43b63cc))
* **package:** specify supported npm version ([f72e622](https://github.com/ReactiveX/RxJS/commit/f72e622))
* **switchAll:** switch all will properly handle async observables ([c2e2d29](https://github.com/ReactiveX/RxJS/commit/c2e2d29))
* **switchAll/switchLatest:** inner subscriptions should now properly unsub ([38a45f8](https://github.com/ReactiveX/RxJS/commit/38a45f8)), closes [#302](https://github.com/ReactiveX/RxJS/issues/302)

### Features

* **combineLatest:** supports promises, iterables, lowercase-o observables and Observables ([ce76e4e](https://github.com/ReactiveX/RxJS/commit/ce76e4e))
* **config:** add global configuration of Promise capability ([e7eb5d7](https://github.com/ReactiveX/RxJS/commit/e7eb5d7)), closes [#115](https://github.com/ReactiveX/RxJS/issues/115)
* **expand:** now handles promises, iterables and lowercase-o observables ([c5239e9](https://github.com/ReactiveX/RxJS/commit/c5239e9))
* **mergeAll:** now supports promises, iterables and lowercase-o observables ([4c16aa6](https://github.com/ReactiveX/RxJS/commit/4c16aa6))
* **operator:** add elementAt operator ([cd562c4](https://github.com/ReactiveX/RxJS/commit/cd562c4))
* **operator:** add isEmpty operator ([80f72c5](https://github.com/ReactiveX/RxJS/commit/80f72c5))
* **operator:** add last operator ([d841b11](https://github.com/ReactiveX/RxJS/commit/d841b11)), closes [#304](https://github.com/ReactiveX/RxJS/issues/304) [#306](https://github.com/ReactiveX/RxJS/issues/306)
* **operator:** add single operator ([49484a2](https://github.com/ReactiveX/RxJS/commit/49484a2))
* **switch:** add promise, iterable and array support ([24fdd34](https://github.com/ReactiveX/RxJS/commit/24fdd34))
* **withLatestFrom:** default array output, handle other types ([cb393dc](https://github.com/ReactiveX/RxJS/commit/cb393dc))
* **zip:** supports promises, iterables and lowercase-o observables ([d332a0e](https://github.com/ReactiveX/RxJS/commit/d332a0e))



<a name="0.0.0-prealpha.3"></a>
# [0.0.0-prealpha.3](https://github.com/ReactiveX/RxJS/compare/0.0.0-prealpha.2...0.0.0-prealpha.3) (2015-09-11)


### Bug Fixes

* **root:** use self as the root object when available ([0428a85](https://github.com/ReactiveX/RxJS/commit/0428a85))



<a name="0.0.0-prealpha.2"></a>
# [0.0.0-prealpha.2](https://github.com/ReactiveX/RxJS/compare/0.0.0-prealpha.1...0.0.0-prealpha.2) (2015-09-11)


### Bug Fixes

* **bufferCount:** set default value for skip argument, do not emit empty buffer at the end ([2c1a9dc](https://github.com/ReactiveX/RxJS/commit/2c1a9dc))
* **windowCount:** set default value for skip argument, do not emit empty buffer at the end ([a513dbb](https://github.com/ReactiveX/RxJS/commit/a513dbb))

### Features

* **Observable:** add static create method ([e0d27ba](https://github.com/ReactiveX/RxJS/commit/e0d27ba)), closes [#255](https://github.com/ReactiveX/RxJS/issues/255)
* **TestScheduler:** add TestScheduler ([b23daf1](https://github.com/ReactiveX/RxJS/commit/b23daf1)), closes [#270](https://github.com/ReactiveX/RxJS/issues/270)
* **VirtualTimeScheduler:** add VirtualTimeScheduler ([96f9386](https://github.com/ReactiveX/RxJS/commit/96f9386)), closes [#269](https://github.com/ReactiveX/RxJS/issues/269)
* **operator:** add sample and sampleTime ([9e62789](https://github.com/ReactiveX/RxJS/commit/9e62789)), closes [#178](https://github.com/ReactiveX/RxJS/issues/178)



<a name="0.0.0-prealpha.1"></a>
# [0.0.0-prealpha.1](https://github.com/ReactiveX/RxJS/compare/0441dea...0.0.0-prealpha.1) (2015-09-02)


### Bug Fixes

* **combineLatest:** check for limits higher than total observable count ([81e5dfb](https://github.com/ReactiveX/RxJS/commit/81e5dfb))
* **rx:** add hack to export global until better global build exists ([1a543b0](https://github.com/ReactiveX/RxJS/commit/1a543b0))
* **subscription-ref:** add setter for isDisposed ([6fe5427](https://github.com/ReactiveX/RxJS/commit/6fe5427))
* **take:** complete on limit reached ([801a711](https://github.com/ReactiveX/RxJS/commit/801a711))

### Features

* **benchpress:** add benchpress config and flatmap spec ([0441dea](https://github.com/ReactiveX/RxJS/commit/0441dea))
* **catch:** add catch operator, related to #141, closes #130 ([94b4c01](https://github.com/ReactiveX/RxJS/commit/94b4c01)), closes [#130](https://github.com/ReactiveX/RxJS/issues/130)
* **from:** let from handle any "observablesque" ([526d4c3](https://github.com/ReactiveX/RxJS/commit/526d4c3)), closes [#156](https://github.com/ReactiveX/RxJS/issues/156) [#236](https://github.com/ReactiveX/RxJS/issues/236)
* **index:** add index module which requires commonjs build ([379d2d1](https://github.com/ReactiveX/RxJS/commit/379d2d1)), closes [#117](https://github.com/ReactiveX/RxJS/issues/117)
* **observable:** add Observable.all (forkJoin) ([44a4ee1](https://github.com/ReactiveX/RxJS/commit/44a4ee1))
* **operator:** Add count operator. ([30dd894](https://github.com/ReactiveX/RxJS/commit/30dd894))
* **operator:** Add distinctUntilChanged and distinctUntilKeyChanged ([f9ba4da](https://github.com/ReactiveX/RxJS/commit/f9ba4da))
* **operator:** Add do operator. ([7d9b52b](https://github.com/ReactiveX/RxJS/commit/7d9b52b))
* **operator:** Add expand operator. ([47b178b](https://github.com/ReactiveX/RxJS/commit/47b178b))
* **operator:** Add minimal delay operator. ([7851885](https://github.com/ReactiveX/RxJS/commit/7851885))
* **operator:** add buffer operators: buffer, bufferWhen, bufferTime, bufferCount, and bufferTog ([9f8347f](https://github.com/ReactiveX/RxJS/commit/9f8347f)), closes [#207](https://github.com/ReactiveX/RxJS/issues/207)
* **operator:** add debounce ([f03adaf](https://github.com/ReactiveX/RxJS/commit/f03adaf)), closes [#193](https://github.com/ReactiveX/RxJS/issues/193)
* **operator:** add defaultIfEmpty ([c80688b](https://github.com/ReactiveX/RxJS/commit/c80688b))
* **operator:** add finally ([526e4c9](https://github.com/ReactiveX/RxJS/commit/526e4c9))
* **operator:** add fromEventPattern creator function ([1095d4c](https://github.com/ReactiveX/RxJS/commit/1095d4c))
* **operator:** add groupBy ([1e13aea](https://github.com/ReactiveX/RxJS/commit/1e13aea)), closes [#165](https://github.com/ReactiveX/RxJS/issues/165)
* **operator:** add materialize. closes #132 ([6d9f6ae](https://github.com/ReactiveX/RxJS/commit/6d9f6ae)), closes [#132](https://github.com/ReactiveX/RxJS/issues/132)
* **operator:** add publishBehavior operator and spec ([249ab8d](https://github.com/ReactiveX/RxJS/commit/249ab8d))
* **operator:** add publishReplay operator and spec ([a0c47d6](https://github.com/ReactiveX/RxJS/commit/a0c47d6))
* **operator:** add retry ([4451db5](https://github.com/ReactiveX/RxJS/commit/4451db5))
* **operator:** add retryWhen operator. closes #129 ([65eb50e](https://github.com/ReactiveX/RxJS/commit/65eb50e)), closes [#129](https://github.com/ReactiveX/RxJS/issues/129)
* **operator:** add skipUntil ([ef2620e](https://github.com/ReactiveX/RxJS/commit/ef2620e)), closes [#180](https://github.com/ReactiveX/RxJS/issues/180)
* **operator:** add throttle ([1d735b9](https://github.com/ReactiveX/RxJS/commit/1d735b9)), closes [#191](https://github.com/ReactiveX/RxJS/issues/191)
* **operator:** add timeout and timeoutWith ([bb440ad](https://github.com/ReactiveX/RxJS/commit/bb440ad)), closes [#244](https://github.com/ReactiveX/RxJS/issues/244)
* **operator:** add toPromise operator. closes #159 ([361a53b](https://github.com/ReactiveX/RxJS/commit/361a53b)), closes [#159](https://github.com/ReactiveX/RxJS/issues/159)
* **operator:** add window operators: window, windowWhen, windowTime, windowCount, windowToggle ([9f5d510](https://github.com/ReactiveX/RxJS/commit/9f5d510)), closes [#195](https://github.com/ReactiveX/RxJS/issues/195)
* **operator:** add withLatestFrom ([322218a](https://github.com/ReactiveX/RxJS/commit/322218a)), closes [#209](https://github.com/ReactiveX/RxJS/issues/209)
* **operator:** implement startWith(). ([1f36d99](https://github.com/ReactiveX/RxJS/commit/1f36d99))



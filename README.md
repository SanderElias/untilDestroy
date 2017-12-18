# RxJS 5.5+ lettable OnDestroy operator for Angular 4+

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build with Angular CLI](https://img.shields.io/badge/built%20with-Angular%20CLI-blue.svg)](https://github.com/angular/angular-cli)

The meat of this project is [/src/app/untilDestroy](src/app/untilDestroy.ts).
It contains a [RxJs lettable operator](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md) that can be used
in an Angular project to unsubscribe your subscriptions at destroy.

[If there is interest enough, I will make it into an NPM module.](https://github.com/SanderElias/untilDestroy/issues/1)

```typescript
import { untilDestroy } from './src/app/untilDestroy';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'hello-sample',
  template: `
    <h1>Hello OnDestroy Operator</h1>
    <p>{{sample$|async | date:"HH:mm:ss"}}</p>
    <p>{{sample1$|async | date:"HH:mm:ss"}}</p>
  `
})
export class HelloComponent implements OnInit, OnDestroy {
  // assign the operator to a class property
  completeOnDestroy = untilDestroy(this);

  sample$ = timer(0, 500).pipe(
    // add it to your observables
    this.completeOnDestroy,
    map(() => new Date())
  );

  sample1$ = timer(0, 500).pipe(
    // as an alternate use, you can do this directly
    untilDestroy(this),
    map(() => new Date())
  );

  ngOnInit() {
    this.sample$.subscribe();
    this.sample1$.subscribe();
  }

  ngOnDestroy() {}
}
```

You can try [this project here](https://sanderelias.github.io/untilDestroy/)

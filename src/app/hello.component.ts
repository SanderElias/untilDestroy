import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { timer } from 'rxjs/observable/timer';
import { takeUntil, map, tap } from 'rxjs/operators';
import { untilDestroy } from './untilDestroy';

const logIt = {
  next(x) {
    console.log('next', x);
  },
  error(e) {
    console.error('error', e);
  },
  complete() {
    console.log('completed');
  }
};

@Component({
  selector: 'hello',
  template: `
    <h1>Hello {{name}}!</h1>
    <p>{{sample$|async | date:"HH:mm:ss"}}</p>
    <p>{{sample1$|async | date:"HH:mm:ss"}}</p>

  `,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent implements OnInit, OnDestroy{
  // untilDestroy$ = untilDestroy(this)
  sample$ = timer(0, 500).pipe(
    untilDestroy(this),
    map(() => new Date()),
    tap(logIt)
  );
  sample1$ = timer(0, 500).pipe(
    untilDestroy(this),
    map(() => new Date()),
    tap(logIt)
  );

  @Input() name: string;

  ngOnInit() {
    this.sample$.subscribe();
    this.sample1$.subscribe();
    this.sample1$.subscribe();
  }

  ngOnDestroy() {
    console.log('destroy');
    // this.destroy$.next()
  }
}

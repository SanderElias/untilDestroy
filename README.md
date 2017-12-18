# RxJS 5.5+ lettable onDestroy operator for Angular 4+

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build with Angular CLI](https://img.shields.io/badge/built%20with-Angular%20CLI-blue.svg)](https://github.com/angular/angular-cli)

The only interesting file in this project is [/src/app/untilDestroy](src/app/untilDestroy.ts).
It contains a [RxJs lettable operator](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md) that can bu used
in an Angular project to unsubscribe your subscriptions at destroy.

A sample on how to use it can be found int the hello component.

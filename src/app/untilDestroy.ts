import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';

// create a symbol identify the observable I add to
// the component so it doesn't conflict with anything.
// I need this so I'm able to add the desired behaviour to the component.
export const destroy$ = Symbol('destroy$');

/**
 * an operator that takes until destroy it takes a components this a parameter
 * returns a lettable RxJS operator.
 */
export const untilDestroy = component => <T>(source: Observable<T>) => {
  if (component[destroy$] === undefined) {
    // only hookup each component once.
    addDestroyObservableToComponent(component);
  }

  // pipe in the takeuntil destroy$ and return the source unaltered
  return source.pipe(takeUntil(component[destroy$]));
};

export function addDestroyObservableToComponent(component) {
  component[destroy$] = new Observable<void>(observer => {
    // keep track of the original destroy function,
    // the user might do something in there
    const orignalDestroy = component.ngOnDestroy;
    if (orignalDestroy === undefined) {
      // Angular does not support dynamic added destroy methods
      // so make sure there is one.
      throw new Error(
        'untilDestroy operator needs the component to have an ngOnDestroy method'
      );
    }
    // replace the ngOndestroy
    component.ngOnDestroy = () => {
      // fire off the destroy observable
      observer.next();
      // complete the observable
      observer.complete();
      // and at last, call the original destroy
      orignalDestroy.call(component);
    };
    // return cleanup function.
    return _ => (component[destroy$] = undefined);
  });
}

import { Observable } from 'rxjs/Observable';
const isHookedUpAlready = Symbol('ComponentHasUntilDestroy');

/**
 * an operator that takes until destroy it takes a components this a parameter
 * returns a lettable RxJS operator.
 */
export const untilDestroy = component => <T>(source: Observable<T>) =>
  new Observable<T>(observer => {
    if (component[isHookedUpAlready] === undefined) {
      // only hookup each component once.
      hookUp(component);
    }
    // add the current observer to the list
    component[isHookedUpAlready].push(observer);

    // return a proxy. Aside from watching for destroy
    // this operator does nothing.
    return source.subscribe(observer);
  });

function hookUp(component) {
  // create a list of observers to unsubscribe and stash it in the closure
  const observerList = [];
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
    // traverse all observers that are added and complete them
    observerList.forEach(o => o.complete());
    // destroy the list, so it won't cause a memory leak
    component[isHookedUpAlready] = undefined;
    // and at last, call the original destroy
    orignalDestroy.call(component);
  };
  // Use a symbol to 'mark' the component it has an untilDestroy operator
  component[isHookedUpAlready] = observerList;
}

import { StateContext, StateOperator } from '@ngxs/store';
import { createDraft, finishDraft } from 'immer';
import { Observable } from 'rxjs';

export class ImmutableStateContext<T extends object> implements StateContext<T> {
  constructor(private ctx: StateContext<T>) {
    ImmutableStateContext.autobindStateContext(this);
  }

  private static autobindStateContext(context: any): void {
    for (const prop of Object.getOwnPropertyNames(Object.getPrototypeOf(context))) {
      if (prop === 'constructor' || typeof context[prop] !== 'function') {
        continue;
      }

      context[prop] = context[prop].bind(context);
    }
  }

  public getState(): T {
    return createDraft(this.ctx.getState()) as T;
  }

  public setState(val: T | StateOperator<T>): T {
    if (typeof val === 'function') {
      const operator: StateOperator<T> = val as StateOperator<T>;
      const state: T = createDraft(this.ctx.getState()) as T;
      const mutatedState: T = operator(state);

      if (state !== mutatedState) {
        finishDraft(state);
      }

      const newState: T = state !== mutatedState ? this.clone(mutatedState) : (finishDraft(mutatedState) as T);

      return this.ctx.setState(newState);
    } else {
      return this.ctx.setState(finishDraft(val) as T);
    }
  }

  public patchState(val: Partial<T>): T {
    return this.ctx.patchState(finishDraft(val) as Partial<T>);
  }

  public dispatch(actions: any | any[]): Observable<void> {
    return this.ctx.dispatch(actions);
  }

  private clone<T = any>(obj: T): T {
    let copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy as T;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = this.clone(obj[attr]);
        }
      }
      return copy;
    }

    throw new Error(`Unable to copy obj! Its type isn't supported.`);
  }
}

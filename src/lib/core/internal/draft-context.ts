import { StateContext, StateOperator } from '@ngxs/store';
import { createDraft } from 'immer';
import { Observable } from 'rxjs';

export function draftContext<T = any>(ctx: StateContext<T>): StateContext<T> {
  return {
    getState(): T {
      return createDraft(ctx.getState()) as T;
    },
    setState(val: T | StateOperator<T>): T {
      if (typeof val === 'function') {
        const operator: StateOperator<T> = val as StateOperator<T>;
        const state: T = createDraft(ctx.getState()) as T;
        return ctx.setState(operator(state));
      } else {
        return ctx.setState(val);
      }
    },
    patchState(val: Partial<T>): T {
      return ctx.patchState(val);
    },
    dispatch(actions: any | any[]): Observable<void> {
      return ctx.dispatch(actions);
    }
  };
}

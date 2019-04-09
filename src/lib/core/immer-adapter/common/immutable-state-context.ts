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
      const newState: T = finishDraft(operator(state)) as T;
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
}

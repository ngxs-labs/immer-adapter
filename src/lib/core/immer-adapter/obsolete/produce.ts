import { Draft, produce as immerProduce } from 'immer';
import { StateContext, StateOperator } from '@ngxs/store';
import { isValidContext } from '../common/utils';


/**
 * An adapter function for the `produce` from `immer` library
 *
 * @param ctx - Reference to the `StateContext` plain object
 * @param recipe - Function that receives a proxy of the current state
 * @deprecated - use immutable helpers from ngxs v3.4.x
 * @returns - New state or throws an error
 */
export function produce<T = any>(ctx: StateContext<T>, recipe: (draft: Draft<T>) => void | T): never | T {
  const invalidContext = !isValidContext<T>(ctx);

  if (invalidContext) {
    throw new Error('You should provide `StateContext` object as the first argument of the `produce` function');
  }

  return ctx.setState(((state: T) => immerProduce(state, recipe)) as StateOperator<T>);
}

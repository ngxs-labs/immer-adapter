import { produce as immerProduce, Draft } from 'immer';
import { StateContext } from '@ngxs/store';

import { isValidContext } from '../internal/internals';

/**
 * An adapter function for the `produce` from `immer` library
 *
 * @param ctx - Reference to the `StateContext` plain object
 * @param recipe - Function that receives a proxy of the current state
 * @returns - New state or throws an error
 */
export function produce<T = unknown, U = unknown>(ctx: StateContext<T>, recipe: (draft: Draft<T>) => void | T): never | U {
    const invalidContext = !isValidContext<T>(ctx);

    if (invalidContext) {
        throw new Error('You should provide `StateContext` object as the first argument of the `produce` function');
    }

    const { getState, setState } = ctx;
    return setState(immerProduce(getState(), recipe));
}

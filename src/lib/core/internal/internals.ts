import { StateContext } from '@ngxs/store';

/**
 * An utility function, that determines if provided target is defined and not nullable
 *
 * @param target - Value to check for being `undefined` or `null`
 * @returns - True if the passed target is not `undefined` and not `null`
 */
function isDefined<T = unknown>(target: T): boolean {
    return target !== undefined && target !== null;
}

/**
 * An utility function, that determines if provided object is valid
 *
 * @param ctx - `StateContext` plain object
 * @returns - True if provided object is valid and has necessary methods
 */
export function isValidContext<T = unknown>(ctx: StateContext<T>): boolean {
    return isDefined(ctx) && typeof ctx.getState === 'function' && typeof ctx.setState === 'function';
}

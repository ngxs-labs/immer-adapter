import { StateContext } from '@ngxs/store';

/**
 * An utility function
 *
 * @param target - Value to check for being `undefined` or `null`
 * @returns - True if the passed target is not `undefined` and not `null`
 */
function isDefined<T>(target: T): boolean {
    return target !== undefined && target !== null;
}

export function isValidContext<T = any>(ctx: StateContext<T>): boolean {
    return isDefined(ctx) && typeof ctx.getState === 'function' && typeof ctx.setState === 'function';
}

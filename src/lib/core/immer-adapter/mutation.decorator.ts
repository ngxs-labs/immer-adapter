import { StateContext } from '@ngxs/store';
import { draftContext } from '../internal/draft-context';

export function Mutation(): Function {
  return function(_target: Object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value;

    descriptor.value = function(ctx: StateContext<any>, action: any, ...args: any[]) {
      return method.apply(this, [draftContext(ctx), action, ...args]);
    };

    return descriptor;
  };
}

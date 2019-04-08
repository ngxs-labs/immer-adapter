import { StateContext } from '@ngxs/store';
import { ImmutableContext } from 'immer-adapter/lib/core/immer-adapter/common/immutable-state-context';

export function Mutation(): Function {
  return function(_target: Object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value;

    descriptor.value = function(ctx: StateContext<any>, action: any, ...args: any[]) {
      return method.apply(this, [new ImmutableContext(ctx), action, ...args]);
    };

    return descriptor;
  };
}

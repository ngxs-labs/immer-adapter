import { StateContext } from '@ngxs/store';
import { ImmutableStateContext } from '../common/immutable-state-context';

export function ImmutableContext(): Function {
  return function(_target: Object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value;

    descriptor.value = function(ctx: StateContext<any>, action: any, ...args: any[]) {
      return method.apply(this, [new ImmutableStateContext(ctx), action, ...args]);
    };

    return descriptor;
  };
}

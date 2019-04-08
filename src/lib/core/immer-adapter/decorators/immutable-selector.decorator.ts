import { createDraft } from 'immer';

export function ImmutableSelector(): Function {
  return function(_target: Object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value;

    descriptor.value = function(state: any, ...args: any[]) {
      return method.apply(this, [createDraft(state), ...args]);
    };

    return descriptor;
  };
}

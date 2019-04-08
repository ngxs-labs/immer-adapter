import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ImmutableContext } from '../../lib/core/immer-adapter/decorators/immutable-context.decorator';
import { ImmutableSelector } from '../../lib/core/immer-adapter/decorators/immutable-selector.decorator';

export interface PizzaStateModel {
  margherita: {
    toppings: string[];
    prices: {
      small: string;
      medium: string;
      large: string;
    };
  };

  prosciutto: {
    toppings: string[];
    prices: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

export const pizzasInitialState = {
  margherita: {
    toppings: ['tomato sauce', 'mozzarella cheese'],
    prices: {
      small: '5.00',
      medium: '6.00',
      large: '7.00'
    }
  },
  prosciutto: {
    toppings: ['tomato sauce', 'mozzarella cheese', 'ham'],
    prices: {
      small: '6.50',
      medium: '7.50',
      large: '8.50'
    }
  }
};

export class PizzasImmutableAction {
  public static type = 'Pizzas Immutable Action';

  constructor(public payload: string) {}
}

@State<PizzaStateModel>({
  name: 'pizzas',
  defaults: pizzasInitialState
})
export class PizzaState {
  @Selector()
  @ImmutableSelector()
  public static margheritaToppings(state: PizzaStateModel): string[] {
    return state.margherita.toppings.reverse();
  }

  @ImmutableContext()
  @Action(PizzasImmutableAction)
  public immutableFeedZebra(ctx: StateContext<PizzaStateModel>, { payload }: PizzasImmutableAction): void {
    ctx.setState(state => {
      state.margherita.toppings.push(payload);
      state.prosciutto.toppings.unshift(payload);
      return state;
    });
  }
}

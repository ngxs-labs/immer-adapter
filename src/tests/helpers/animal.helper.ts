import { Action, State, StateContext } from '@ngxs/store';
import { ImmutableContext } from '../../lib/core/immer-adapter/decorators/immutable-context.decorator';

export interface AnimalsStateModel {
  zebra: {
    food: string[];
    name: string;
  };
  panda: {
    food: string[];
    name: string;
  };
}

export const animalInitialState: AnimalsStateModel = {
  zebra: {
    food: [],
    name: 'zebra'
  },
  panda: {
    food: [],
    name: 'panda'
  }
};

export class FeedZebra {
  public static type = 'Feed Zebra';

  constructor(public payload: string) {}
}

export class FeedImmutableZebra {
  public static type = 'Feed Immutable Zebra';

  constructor(public payload: string) {}
}

@State<AnimalsStateModel>({
  name: 'animals',
  defaults: animalInitialState
})
export class AnimalState {
  private static mutate(ctx: StateContext<AnimalsStateModel>, payload: string): void {
    const state = ctx.getState();
    state.zebra.food.push(payload);
    ctx.setState(state);
  }

  @Action(FeedZebra)
  public mutateFeedZebra(ctx: StateContext<AnimalsStateModel>, { payload }: FeedZebra): void {
    AnimalState.mutate(ctx, payload);
  }

  @ImmutableContext()
  @Action(FeedImmutableZebra)
  public immutableFeedZebra(ctx: StateContext<AnimalsStateModel>, { payload }: FeedImmutableZebra): void {
    AnimalState.mutate(ctx, payload);
  }
}

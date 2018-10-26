# immer-adapter

Before

```ts
import { State, StateContext } from '@ngxs/store';
import { Receiver } from '@ngxs-labs/emitter';

@State<ZooStateModel>({
  name: 'zoo',
  defaults: {
    zebra: { food: [], name: 'zebra' },
    panda: { food: [], name: 'panda' }
  }
})
export class AnimalState {
  @Receiver()
  feedZebra(ctx: StateContext<AnimalStateModel>, action: FeedZebra) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      zebra: {
         ...state.zebra,
         food: [ ...state.zebra.food,  action.zebraToFeed]
      }
    });
  }
}
```

After

```ts
import { State, StateContext } from '@ngxs/store';
import { Reciver } from '@ngxs-labs/emitter';
import { produce } from '@ngxs-labs/immer-adapter';

@State<ZooStateModel>({
  name: 'zoo',
  defaults: {
    zebra: { food: [], name: 'zebra' },
    panda: { food: [], name: 'panda' }
  }
})
export class AnimalState {
  @Receiver()
  feedZebra(ctx: StateContext<AnimalStateModel>, action: FeedZebra) {
    produce(ctx, (draft: AnimalStateModel) => draft.zebra.food.push(action.zebraToFeed));
  }
}
```

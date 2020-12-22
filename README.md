<p align="center">
    <img src="https://raw.githubusercontent.com/ngxs-labs/emitter/master/docs/assets/logo.png">
</p>

---

> Declarative state mutations

[![Build Status](https://travis-ci.org/ngxs-labs/immer-adapter.svg?branch=master)](https://travis-ci.org/ngxs-labs/immer-adapter)
[![NPM](https://badge.fury.io/js/%40ngxs-labs%2Fimmer-adapter.svg)](https://www.npmjs.com/package/@ngxs-labs/immer-adapter)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/ngxs-labs/immer-adapter/blob/master/LICENSE)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3f1e798f0a174a20940fb9d5f5e50a43)](https://www.codacy.com/app/arturovt/immer-adapter?utm_source=github.com&utm_medium=referral&utm_content=ngxs-labs/immer-adapter&utm_campaign=Badge_Grade)

<p align="center">
    <img src="https://raw.githubusercontent.com/ngxs-labs/immer-adapter/master/docs/assets/immer.png">
</p>

#### 📦 Install

To install `@ngxs-labs/immer-adapter` and `immer` that is a peer-dependency run the following command:

```console
npm install @ngxs-labs/immer-adapter immer
# or if you use yarn
yarn add @ngxs-labs/immer-adapter immer
```

##### Before

When your state is growing - it becomes harder to manage such mutations:

```ts
import { State, Action, StateContext } from '@ngxs/store';

export class FeedZebra {
  public static readonly type = '[Animals] Feed zebra';
  constructor(public payload: string) {}
}

@State<AnimalsStateModel>({
  name: 'animals',
  defaults: {
    zebra: {
      food: ['leaves', 'bark'],
      name: 'zebra'
    },
    panda: {
      food: [],
      name: 'panda'
    }
  }
})
export class AnimalState {
  @Selector()
  public static zebraFood(state: AnimalsStateModel): string[] {
    const zebraFood = [...state.zebra.food];
    zebraFood.reverse();
  }

  @Action(Add)
  public add({ getState, setState }: StateContext<AnimalsStateModel>, { payload }: Add): void {
    setState((state: AnimalsStateModel) => ({
      ...state,
      zebra: {
        ...state.zebra,
        food: [ ...state.zebra.food, payload ]
      }
    }));
  }
}
```

##### After

`immer-adapter` gives you the opportunity to manage mutations in a more declarative way:

```ts
import { ImmutableContext, ImmutableSelector } from '@ngxs-labs/immer-adapter';

@State<AnimalsStateModel>({
  name: 'animals',
  defaults: {
    zebra: {
      food: [],
      name: 'zebra'
    },
    panda: {
      food: [],
      name: 'panda'
    }
  }
})
export class AnimalState {
  @Selector()
  @ImmutableSelector()
  public static zebraFood(state: AnimalsStateModel): string[] {
    return state.zebra.food.reverse();
  }

  @Action(Add)
  @ImmutableContext()
  public add({ setState }: StateContext<AnimalsStateModel>, { payload }: Add): void {
    setState((state: AnimalsStateModel) => {
      state.zebra.food.push(payload);
      return state;
    });
  }
}
```

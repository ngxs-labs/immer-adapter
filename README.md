<p align="center">
    <img src="https://raw.githubusercontent.com/ngxs-labs/emitter/master/docs/assets/logo.png">
</p>

---

> Declarative state mutations

[![Build Status](https://travis-ci.org/ngxs-labs/immer-adapter.svg?branch=master)](https://travis-ci.org/ngxs-labs/immer-adapter)
[![NPM](https://badge.fury.io/js/%40ngxs-labs%2Fimmer-adapter.svg)](https://www.npmjs.com/package/@ngxs-labs/immer-adapter)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/ngxs-labs/immer-adapter/blob/master/LICENSE)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3f1e798f0a174a20940fb9d5f5e50a43)](https://www.codacy.com/app/arturovt/immer-adapter?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ngxs-labs/immer-adapter&amp;utm_campaign=Badge_Grade)

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

#### Produce operator

##### Before

When your state is growing - it becomes harder to manage such mutations:

```ts
import { State, Action, StateContext } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';

export class FeedZebra {
    public static readonly type = '[Animals] Feed zebra';
    constructor(public payload: string) {}
}

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
    @Action(FeedZebra)
    public feedZebra({ getState, setState }: StateContext<AnimalsStateModel>, { payload }: FeedZebra) {
        const state = getState();
        setState({
            ...state,
            zebra: {
                ...state.zebra,
                food: [...state.zebra.food, payload]
            }
        });
    }
}
```

##### After

`immer-adapter` gives you the opportunity to manage mutations in a more declarative way:

```ts
import { State, Action, StateContext } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { produce } from '@ngxs-labs/immer-adapter';

export class FeedZebra {
    public static readonly type = '[Animals] Feed zebra';
    constructor(public payload: string) {}
}

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
    @Action(FeedZebra)
    public feedZebra(ctx: StateContext<AnimalsStateModel>, { payload }: FeedZebra) {
        produce(ctx, (draft: AnimalsStateModel) => draft.zebra.food.push(payload));
    }
}
```

import { State, StateContext } from '@ngxs/store';
import { Emittable, Emitter, EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Component } from '@angular/core';

import { Mutation } from '../../public_api';

export interface Todo {
  text: string;
  completed: boolean;
}

export const todosInitialState: Todo[] = [{ text: 'hello', completed: true }];

@State<Todo[]>({
  name: 'todos',
  defaults: todosInitialState
})
export class TodosState {
  @Receiver()
  public static mutableAddTodo(ctx: StateContext<Todo[]>, { payload }: EmitterAction<Todo>): void {
    this.mutate(ctx, payload as Todo);
  }

  @Receiver()
  @Mutation()
  public static immutableAddTodo(ctx: StateContext<Todo[]>, { payload }: EmitterAction<Todo>): void {
    this.mutate(ctx, payload as Todo);
  }

  private static mutate(ctx: StateContext<Todo[]>, todo: Todo): void {
    ctx.setState((state: Todo[]) => {
      state.push(todo);
      return state;
    });
  }
}

@Component({ template: '' })
export class MockComponent {
  @Emitter(TodosState.mutableAddTodo)
  public mutableAddTodo!: Emittable<Todo>;

  @Emitter(TodosState.immutableAddTodo)
  public immutableAddTodo!: Emittable<Todo>;
}

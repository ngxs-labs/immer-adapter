import { TestBed } from '@angular/core/testing';
import { Component, Injectable, Injector } from '@angular/core';
import { NgxsModule, State, StateContext, Store } from '@ngxs/store';
import { Emittable, Emitter, EmitterAction, NgxsEmitPluginModule, Receiver } from '@ngxs-labs/emitter';

import { Observable, of } from 'rxjs';
import { delay, first, tap } from 'rxjs/operators';

import { produce } from '../public_api';

interface Todo {
  text: string;
  completed: boolean;
}

describe('Adapter API 1.x', () => {
  it('should add todo using immer adapter', () => {
    @State<Todo[]>({
      name: 'todos',
      defaults: []
    })
    class TodosState {
      @Receiver({ type: '[Todos] Add todo' })
      public static addTodo(ctx: StateContext<Todo[]>, { payload }: EmitterAction<Todo>): void {
        produce<Todo[]>(ctx, draft => {
          draft.push(payload!);
        });
      }
    }

    @Component({ template: '' })
    class MockComponent {
      @Emitter(TodosState.addTodo)
      public addTodo!: Emittable<Todo>;
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TodosState]), NgxsEmitPluginModule.forRoot()],
      declarations: [MockComponent]
    });

    const fixture = TestBed.createComponent(MockComponent);
    const store: Store = TestBed.get(Store);

    fixture.componentInstance.addTodo.emit({
      text: 'Buy coffee',
      completed: false
    });

    const todos = store.selectSnapshot<Todo[]>(({ todos }) => todos);
    expect(todos.length).toBe(1);
  });

  it('should get todos after delay using immer adapter', (done: jest.DoneCallback) => {
    @Injectable()
    class ApiService {
      private size = 10;

      public getTodosFromServer(length: number): Observable<Todo[]> {
        return of(this.generateTodoMock(length)).pipe(delay(1000));
      }

      private generateTodoMock(size?: number): Todo[] {
        const length = size || this.size;
        return Array.from({ length }).map(() => ({
          text: 'buy some coffee',
          completed: false
        }));
      }
    }

    @State<Todo[]>({
      name: 'todos',
      defaults: []
    })
    class TodosState {
      private static api: ApiService = null!;

      constructor(injector: Injector) {
        TodosState.api = injector.get<ApiService>(ApiService);
      }

      @Receiver({ type: '[Todos] Get todos' })
      public static getTodos(ctx: StateContext<Todo[]>) {
        return this.api.getTodosFromServer(10).pipe(
          first(),
          tap(todos =>
            produce(ctx, draft => {
              draft.push(...todos);
            })
          )
        );
      }
    }

    @Component({ template: '' })
    class MockComponent {
      @Emitter(TodosState.getTodos)
      public getTodos!: Emittable<void>;
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TodosState]), NgxsEmitPluginModule.forRoot()],
      declarations: [MockComponent],
      providers: [ApiService]
    });

    const fixture = TestBed.createComponent(MockComponent);
    const store: Store = TestBed.get(Store);

    fixture.componentInstance.getTodos.emit().subscribe(() => {
      const todos = store.selectSnapshot<Todo[]>(({ todos }) => todos);
      expect(todos.length).toBe(10);
      done();
    });
  });

  it('should update nested data in state', () => {
    interface ZooStateModel {
      zebra: {
        food: string[];
        name: 'zebra';
      };
      panda: {
        food: string[];
        name: 'panda';
      };
    }

    @State<ZooStateModel>({
      name: 'zoo',
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
    class ZooState {
      @Receiver()
      public static feedZebra(ctx: StateContext<ZooStateModel>, { payload }: EmitterAction<string>): void {
        produce(ctx, draft => {
          draft.zebra.food.push(payload!);
        });
      }
    }

    @Component({ template: '' })
    class MockComponent {
      @Emitter(ZooState.feedZebra)
      public feedZebra!: Emittable<string>;
    }

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ZooState]), NgxsEmitPluginModule.forRoot()],
      declarations: [MockComponent]
    });

    const fixture = TestBed.createComponent(MockComponent);
    const store: Store = TestBed.get(Store);

    fixture.componentInstance.feedZebra.emit('grass');

    const { food } = store.selectSnapshot<ZooStateModel>(state => state.zoo).zebra;
    expect(food.length).toBe(1);
    expect(food).toContain('grass');
  });
});

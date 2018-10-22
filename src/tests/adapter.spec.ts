import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { State, StateContext, NgxsModule, Store } from '@ngxs/store';
import { Receiver, EmitterAction, NgxsEmitPluginModule, Emitter, Emittable } from '@ngxs-labs/emitter';

import { produce } from '../lib/core/adapter/adapter';

describe('Adapter', () => {
    interface Todo {
        title: string;
        completed: boolean;
    }

    @State<Todo[]>({
        name: 'todos',
        defaults: []
    })
    class TodosState {
        @Receiver({ type: '[Todos] Add todo' })
        public static addTodo(ctx: StateContext<Todo[]>, { payload }: EmitterAction<Todo>): void {
            produce<Todo[]>(ctx, (draft) => {
                draft.push(payload!);
            });
        }
    }

    @Component({
        template: ''
    })
    class MockComponent {
        @Emitter(TodosState.addTodo)
        public addTodo!: Emittable<Todo>;
    }

    it('should increase todos length by 1', () => {
        TestBed.configureTestingModule({
            imports: [
                NgxsModule.forRoot([TodosState]),
                NgxsEmitPluginModule.forRoot()
            ],
            declarations: [
                MockComponent
            ]
        });

        const fixture = TestBed.createComponent(MockComponent);
        const store: Store = TestBed.get(Store);

        fixture.componentInstance.addTodo.emit({
            title: 'Buy coffee',
            completed: false
        });

        expect(store.selectSnapshot<Todo[]>((state) => state.todos).length).toBe(1);
    });
});

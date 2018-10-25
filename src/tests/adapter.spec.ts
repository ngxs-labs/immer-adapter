import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { State, StateContext, NgxsModule, Store } from '@ngxs/store';
import { Receiver, EmitterAction, NgxsEmitPluginModule, Emitter, Emittable } from '@ngxs-labs/emitter';

import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { produce } from '../lib/core/immer-adapter/immer-adapter';

describe('Adapter', () => {
    interface Todo {
        title: string;
        completed: boolean;
    }

    it('should add todo using immer adapter', () => {
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

    it('should add todo after delay using immer adapter', (done: DoneFn) => {
        @State<Todo[]>({
            name: 'todos',
            defaults: []
        })
        class TodosState {
            @Receiver({ type: '[Todos] Add todo' })
            public static addTodo(ctx: StateContext<Todo[]>, { payload }: EmitterAction<Todo>) {
                return of(null).pipe(
                    delay(1000),
                    tap(() => {
                        produce<Todo[]>(ctx, (draft) => {
                            draft.push(payload!);
                        });
                    })
                );
            }
        }

        @Component({
            template: ''
        })
        class MockComponent {
            @Emitter(TodosState.addTodo)
            public addTodo!: Emittable<Todo>;
        }

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
        }).subscribe(() => {
            expect(store.selectSnapshot<Todo[]>((state) => state.todos).length).toBe(1);
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
                produce(ctx, (draft) => {
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
            imports: [
                NgxsModule.forRoot([ZooState]),
                NgxsEmitPluginModule.forRoot()
            ],
            declarations: [
                MockComponent
            ]
        });

        const fixture = TestBed.createComponent(MockComponent);
        const store: Store = TestBed.get(Store);

        fixture.componentInstance.feedZebra.emit('grass');

        const { food } = store.selectSnapshot<ZooStateModel>((state) => state.zoo).zebra;
        expect(food.length).toBe(1);
        expect(food).toContain('grass');
    });
});

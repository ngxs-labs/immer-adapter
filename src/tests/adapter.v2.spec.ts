import { NgxsModule, State, StateContext, Store } from "@ngxs/store";
import {
    Emittable,
    Emitter,
    EmitterAction,
    NgxsEmitPluginModule,
    Receiver
} from "@ngxs-labs/emitter";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Mutation } from "../public_api";

interface Todo {
    text: string;
    completed: boolean;
}

describe("API 2.x", () => {
    @State<Todo[]>({
        name: "todos",
        defaults: [{ text: "hello", completed: true }]
    })
    class TodosState {
        @Receiver()
        public static mutableAddTodo(
            ctx: StateContext<Todo[]>,
            { payload }: EmitterAction<Todo>
        ): void {
            ctx.setState((state: Todo[]) => {
                state.push(payload as Todo);
                return state;
            });
        }

        @Receiver()
        @Mutation()
        public static immutableAddTodo(
            ctx: StateContext<Todo[]>,
            { payload }: EmitterAction<Todo>
        ): void {
            ctx.setState((state: Todo[]) => {
                state.push(payload as Todo);
                return state;
            });
        }
    }

    @Component({ template: "" })
    class MockComponent {
        @Emitter(TodosState.mutableAddTodo)
        public mutableAddTodo!: Emittable<Todo>;

        @Emitter(TodosState.immutableAddTodo)
        public immutableAddTodo!: Emittable<Todo>;
    }

    it("should add todo with classic mutation", () => {
        TestBed.configureTestingModule({
            imports: [
                NgxsModule.forRoot([TodosState]),
                NgxsEmitPluginModule.forRoot()
            ],
            declarations: [MockComponent]
        });

        const fixture = TestBed.createComponent(MockComponent);
        const store: Store = TestBed.get(Store);

        const previous = store.selectSnapshot(TodosState);

        expect(previous).toEqual([{ text: "hello", completed: true }]);

        fixture.componentInstance.mutableAddTodo.emit({
            text: "World",
            completed: false
        });

        const newState = store.selectSnapshot(TodosState);

        expect(previous).toEqual([
            { text: "hello", completed: true },
            {
                text: "World",
                completed: false
            }
        ]);

        expect(newState).toEqual([
            { text: "hello", completed: true },
            {
                text: "World",
                completed: false
            }
        ]);
    });

    it("should add todo with using immutable mutation", () => {
        TestBed.configureTestingModule({
            imports: [
                NgxsModule.forRoot([TodosState]),
                NgxsEmitPluginModule.forRoot()
            ],
            declarations: [MockComponent]
        });

        const fixture = TestBed.createComponent(MockComponent);
        const store: Store = TestBed.get(Store);

        const previous = store.selectSnapshot(TodosState);

        expect(previous).toEqual([{ text: "hello", completed: true }]);

        fixture.componentInstance.immutableAddTodo.emit({
            text: "World",
            completed: false
        });

        const newState = store.selectSnapshot(TodosState);

        expect(previous).toEqual([{ text: "hello", completed: true }]);

        expect(newState).toEqual([
            { text: "hello", completed: true },
            {
                text: "World",
                completed: false
            }
        ]);
    });
});

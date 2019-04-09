import { NgxsModule, Store } from '@ngxs/store';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { animalInitialState, AnimalState, FeedImmutableZebra, FeedZebra } from './helpers/animal.helper';
import { MockComponent, todosInitialState, TodosState } from './helpers/todo.helper';
import { PizzasImmutableAction, pizzasInitialState, PizzaState, RemovePriceImmutableAction } from './helpers/pizza.helper';

describe('Immer adapter', () => {
  let store: Store;
  let fixture: ComponentFixture<any>;

  describe('Todo state', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NgxsModule.forRoot([TodosState]), NgxsEmitPluginModule.forRoot()],
        declarations: [MockComponent]
      });

      store = TestBed.get(Store);
      store.reset({ todos: JSON.parse(JSON.stringify(todosInitialState)) });
      fixture = TestBed.createComponent(MockComponent);
    });

    it('should add todo with classic mutation', () => {
      const previous = store.selectSnapshot(TodosState);
      expect(previous).toEqual(todosInitialState);

      fixture.componentInstance.mutableAddTodo.emit({
        text: 'World',
        completed: false
      });

      const newState = store.selectSnapshot(TodosState);
      const equallyMutatedState = [
        { text: 'hello', completed: true },
        {
          text: 'World',
          completed: false
        }
      ];

      expect(previous).toEqual(equallyMutatedState);
      expect(newState).toEqual(equallyMutatedState);
    });

    it('should add todo with using immutable mutation', () => {
      const previous = store.selectSnapshot(TodosState);
      expect(previous).toEqual(todosInitialState);

      fixture.componentInstance.immutableAddTodo.emit({
        text: 'World',
        completed: false
      });

      const newState = store.selectSnapshot(TodosState);

      expect(previous).toEqual(todosInitialState);
      expect(newState).toEqual([
        { text: 'hello', completed: true },
        {
          text: 'World',
          completed: false
        }
      ]);
    });
  });

  describe('Animal state', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NgxsModule.forRoot([AnimalState])]
      });

      store = TestBed.get(Store);
      store.reset({ animals: JSON.parse(JSON.stringify(animalInitialState)) });
    });

    it('should add zebra food with using mutable mutation', () => {
      const previous = store.selectSnapshot(AnimalState);
      expect(previous).toEqual(animalInitialState);

      store.dispatch(new FeedZebra('banana'));
      const newState = store.selectSnapshot(AnimalState);

      const equallyMutatedState = {
        zebra: {
          food: ['banana'],
          name: 'zebra'
        },
        panda: {
          food: [],
          name: 'panda'
        }
      };

      expect(previous).toEqual(equallyMutatedState);
      expect(newState).toEqual(equallyMutatedState);
    });

    it('should add zebra food with using immutable mutation', () => {
      const previous = store.selectSnapshot(AnimalState);
      expect(previous).toEqual(animalInitialState);

      store.dispatch(new FeedImmutableZebra('banana'));
      const newState = store.selectSnapshot(AnimalState);

      expect(previous).toEqual({
        zebra: {
          food: [],
          name: 'zebra'
        },
        panda: {
          food: [],
          name: 'panda'
        }
      });

      expect(newState).toEqual({
        zebra: {
          food: ['banana'],
          name: 'zebra'
        },
        panda: {
          food: [],
          name: 'panda'
        }
      });
    });
  });

  describe('Pizzas state (developmentMode = true)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NgxsModule.forRoot([PizzaState], { developmentMode: true })]
      });

      store = TestBed.get(Store);
      store.reset({ pizzas: JSON.parse(JSON.stringify(pizzasInitialState)) });
    });

    it('should add pizza toppings with using immutable mutation', () => {
      const previous = store.selectSnapshot(PizzaState);
      expect(previous).toEqual(pizzasInitialState);

      store.dispatch(new PizzasImmutableAction('tomato ham'));
      const newState = store.selectSnapshot(PizzaState);

      expect(previous).toEqual(pizzasInitialState);
      expect(newState).toEqual({
        margherita: {
          toppings: ['tomato sauce', 'mozzarella cheese', 'tomato ham'],
          prices: { small: '5.00', medium: '6.00', large: '7.00' }
        },
        prosciutto: {
          toppings: ['tomato ham', 'tomato sauce', 'mozzarella cheese', 'ham'],
          prices: { small: '6.50', medium: '7.50', large: '8.50' }
        }
      });

      const toppings = store.selectSnapshot(PizzaState.margheritaToppings);
      expect(previous).toEqual(pizzasInitialState);
      expect(toppings).toEqual(['tomato ham', 'mozzarella cheese', 'tomato sauce']);
    });

    it('should be correct autobind state context', () => {
      const previous = store.selectSnapshot(PizzaState);
      expect(previous).toEqual(pizzasInitialState);

      store.dispatch(new RemovePriceImmutableAction());
      const newState = store.selectSnapshot(PizzaState);
      expect(previous).toEqual(pizzasInitialState);

      expect(newState).toEqual({
        margherita: { toppings: ['tomato sauce', 'mozzarella cheese'], prices: null },
        prosciutto: { toppings: ['tomato sauce', 'mozzarella cheese', 'ham'], prices: null }
      });
    });
  });
});

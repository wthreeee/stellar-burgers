import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Test bun',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 50,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const main: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Test filling',
  type: 'main'
};

const constructorIngredient = (
  id: string,
  name = main.name
): TConstructorIngredient => ({ ...main, id, name });

describe('burgerConstructor reducer', () => {
  test('returns the initial state for an unknown action', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('adds and replaces a bun', () => {
    const firstState = constructorReducer(undefined, addIngredient(bun));
    const replacement = { ...bun, _id: 'bun-2', name: 'Second bun' };
    const secondState = constructorReducer(
      firstState,
      addIngredient(replacement)
    );

    expect(firstState.bun).toEqual(
      expect.objectContaining({ ...bun, id: expect.any(String) })
    );
    expect(secondState.bun).toEqual(expect.objectContaining(replacement));
    expect(secondState.ingredients).toEqual([]);
  });

  test('adds a filling to the constructor', () => {
    const state = constructorReducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(expect.objectContaining(main));
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  test('removes a filling by its constructor id', () => {
    const first = constructorIngredient('first');
    const second = constructorIngredient('second');
    const state = { bun: null, ingredients: [first, second] };

    expect(constructorReducer(state, removeIngredient('first'))).toEqual({
      bun: null,
      ingredients: [second]
    });
  });

  test('moves a filling to a new position', () => {
    const first = constructorIngredient('first', 'First');
    const second = constructorIngredient('second', 'Second');
    const third = constructorIngredient('third', 'Third');
    const state = { bun: null, ingredients: [first, second, third] };

    expect(
      constructorReducer(state, moveIngredient({ from: 0, to: 2 })).ingredients
    ).toEqual([second, third, first]);
  });

  test('clears the constructor', () => {
    const state = {
      bun: { ...bun, id: 'bun-id' },
      ingredients: [constructorIngredient('main-id')]
    };

    expect(constructorReducer(state, clearConstructor())).toEqual({
      bun: null,
      ingredients: []
    });
  });
});

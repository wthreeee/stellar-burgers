import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Test ingredient',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 50,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png'
};

describe('ingredients reducer', () => {
  test('returns the initial state for an unknown action', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('handles fetchIngredients.pending', () => {
    const state = {
      ingredients: [ingredient],
      isLoading: false,
      error: 'Previous error'
    };

    expect(
      ingredientsReducer(
        state,
        fetchIngredients.pending('request-id', undefined)
      )
    ).toEqual({
      ingredients: [ingredient],
      isLoading: true,
      error: null
    });
  });

  test('handles fetchIngredients.fulfilled', () => {
    const state = {
      ingredients: [],
      isLoading: true,
      error: 'Previous error'
    };

    expect(
      ingredientsReducer(
        state,
        fetchIngredients.fulfilled([ingredient], 'request-id', undefined)
      )
    ).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: null
    });
  });

  test('handles fetchIngredients.rejected', () => {
    const state = {
      ingredients: [ingredient],
      isLoading: true,
      error: null
    };

    expect(
      ingredientsReducer(
        state,
        fetchIngredients.rejected(
          new Error('Ingredients request failed'),
          'request-id',
          undefined
        )
      )
    ).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: 'Ingredients request failed'
    });
  });
});

import path from 'path';
import { expect, Page, test } from '@playwright/test';

const harsPath = path.join(__dirname, 'hars');
const bunId = '643d69a5c3f7b9001cfa093c';
const mainId = '643d69a5c3f7b9001cfa0941';

const useHarMocks = async (page: Page) => {
  await page.routeFromHAR(path.join(harsPath, 'ingredients.har'), {
    notFound: 'fallback'
  });
  await page.routeFromHAR(path.join(harsPath, 'user.har'), {
    notFound: 'fallback'
  });
};

test.describe('burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await useHarMocks(page);
    await page.goto('/');
  });

  test('adds a bun and a filling to the constructor', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`).getByRole('button').click();
    await page.getByTestId(`ingredient-${mainId}`).getByRole('button').click();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });
});

test.describe('ingredient modal', () => {
  test.beforeEach(async ({ page }) => {
    await useHarMocks(page);
    await page.goto('/');
  });

  test('opens details for the selected ingredient and closes by button', async ({
    page
  }) => {
    await page
      .getByTestId(`ingredient-${mainId}`)
      .getByText('Биокотлета из марсианской Магнолии')
      .click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('ingredient-details')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
    await expect(page.getByTestId('ingredient-details')).toContainText('4242');

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).toBeHidden();
  });

  test('closes details by clicking the overlay', async ({ page }) => {
    await page
      .getByTestId(`ingredient-${bunId}`)
      .getByText('Краторная булка N-200i')
      .click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('modal')).toBeHidden();
  });
});

test.describe('order creation', () => {
  test('creates an order, shows its number and clears the constructor', async ({
    context,
    page
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        domain: '127.0.0.1',
        path: '/'
      }
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
    await useHarMocks(page);
    await page.routeFromHAR(path.join(harsPath, 'order.har'), {
      notFound: 'fallback'
    });
    await page.goto('/');

    await page.getByTestId(`ingredient-${bunId}`).getByRole('button').click();
    await page.getByTestId(`ingredient-${mainId}`).getByRole('button').click();
    await page.getByTestId('order-submit').getByRole('button').click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('123456');
    await expect(page.getByTestId('constructor-bun-empty')).toHaveCount(2);
    await expect(
      page.getByTestId('constructor-ingredients-empty')
    ).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).toBeHidden();
  });
});

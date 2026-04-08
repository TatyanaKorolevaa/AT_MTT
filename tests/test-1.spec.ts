import { test, expect } from '@playwright/test';

test('[CIT-28838] Сотрудник - ГО: Поиск по списку клиентов', async ({ page }) => {
  // 1. Переход на страницу логина
  await page.goto('https://admin.itoolabs-stage2.exolve.ru/#/');

  // 2. Проверка видимости полей ввода
  await expect.soft(page.getByRole('textbox', { name: 'ivan@domain.ru' })).toBeVisible();
  await expect.soft(page.locator('input[type="password"]')).toBeVisible();

  // 3. Ввод логина
  const loginInput = page.getByRole('textbox', { name: 'ivan@domain.ru' });
  await loginInput.click();
  await loginInput.fill('at@at.at');

  // 4. Ввод пароля
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.click();
  await passwordInput.fill('1qaz2wsx');

  // 5. Нажатие кнопки входа
  await page.getByRole('button', { name: 'Войти', exact: true }).click();

  // 6. Отображение экрана Домены
  await expect(page).toHaveURL(
    'https://admin.itoolabs-stage2.exolve.ru/#/domains?sortOrder=asc&sortBy=name',
    { timeout: 10000 },
  );

  // 7. Нажатие кнопки Настройки
  await page.getByRole('button', { name: 'Ещё' }).click();
  await page.getByText('Настройки', { exact: true }).click();

  // 6. Отображение экрана Домены
  await expect(page).toHaveURL(
    'https://admin.itoolabs-stage2.exolve.ru/#/settings/managers?sortOrder=asc&sortBy=name',
    { timeout: 10000 },
  );

  // 8. Нажатие кнопки Добавить менеджера
  const addManagerButton = page.getByRole('button', { name: 'Добавить менеджера' });
  await expect.soft(addManagerButton).toBeVisible();
  await addManagerButton.click();

  // 9. Заполнение поля "Имя менеджера"
  const managerNameInput = page.getByRole('textbox', { name: 'Иванов Иван' });
  await expect(managerNameInput).toBeVisible();
  await managerNameInput.click();
  await managerNameInput.fill('Менеджер');

  // 10. Заполнение поля "Пароль"
  const passwordField = page.getByRole('textbox').nth(1);
  await expect(passwordField).toBeVisible();
  await passwordField.click();
  await passwordField.fill('1qaz2wsx');

  // 11. Заполнение поля "Email"
  const emailInput = page.getByRole('textbox', { name: 'ivan@domain.ru' });
  await expect(emailInput).toBeVisible();
  await emailInput.click();
  await emailInput.fill('at4@at.at');

  // 12. Проверка видимости роли сотрудника
  await expect(page.getByRole('textbox', { name: 'Сотрудник – ГО' })).toBeVisible();

  // 13. Сохранение менеджера
  await page.getByRole('button', { name: 'Сохранить' }).click();

  await expect(page).toHaveURL(
    'https://admin.itoolabs-stage2.exolve.ru/#/settings/managers?sortOrder=asc&sortBy=name',
    {
      timeout: 30000,
    },
  );

  // 14. Выход из системы
  //await page.locator('path').nth(2).click();
  //await page.getByRole('button', { name: 'Выйти', exact: true }).click();

  // 15. Открыть на страницу авторизации менеджера
  await page.goto('https://manager.itoolabs-stage2.exolve.ru');

  // 16. Ввод логина сотрудника
  const login1Input = page.getByRole('textbox', { name: 'ivan@domain.ru' });
  await login1Input.click();
  await login1Input.fill('at4@at.at');

  // 17. Ввод пароля сотрудника
  const password2Input = page.locator('input[type="password"]');
  await password2Input.click();
  await password2Input.fill('1qaz2wsx');

  // 18. Нажатие кнопки входа
  await page.getByRole('button', { name: 'Войти', exact: true }).click();

  // 19. Отображение экрана Клиенты

  await expect(page).toHaveURL('https://manager.itoolabs-stage2.exolve.ru/#/', {
    timeout: 30000,
  });
  // 20. Проверка наличия поля Поиска по клиентам
  await expect(page.getByRole('img').nth(3)).toBeVisible();

  // 21. Проверка наличия поля Поиска по телефону
  await page.getByRole('img').nth(2).click();
  await expect(page.getByRole('main')).toContainText('Поиск по телефону');

  // 22. Проверка наличия поля Поиска по менеджеру
  await expect(page.getByRole('main')).toContainText('Поиск по менеджеру');

  // 23. Переход на экран Менеджеров
  await page.goto(
    'https://admin.itoolabs-stage2.exolve.ru/#/settings/managers?sortOrder=asc&sortBy=name',
  );

  // 24. Поиск сотрудника
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('at4');
  await page.getByRole('textbox').press('Enter');

  // 25. Удаление сотрудника
  await page.getByRole('cell', { name: 'Менеджер at4@at.at' }).click();
  await page.getByText('Удалить менеджера').click();
  await page.getByRole('button', { name: 'Удалить' }).click();

  await expect(page).toHaveURL(
    'https://admin.itoolabs-stage2.exolve.ru/#/settings/managers?sortOrder=asc&sortBy=name',
    {
      timeout: 30000,
    },
  );
});

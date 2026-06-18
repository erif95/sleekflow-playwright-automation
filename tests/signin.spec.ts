import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';
import { DataReader } from '../utility';

test.describe('SleekFlow SignIn Flow', () => {
  let loginPage: LoginPage;
  const data = new DataReader('signinData.json');

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('LOG01 - validate error message displayed for empty username and password', async () => {
    expect(await loginPage.isLoginVisible()).toBeTruthy();
    await loginPage.clickLoginAndSwitchToTab();
    await loginPage.loginWithEmpyData();
    await loginPage.validateRequiredErrMessage();
  });

  test('LOG02 - login with wrong password', async () => {
    expect(await loginPage.isLoginVisible()).toBeTruthy();

    const user = data.getArray('signin.invalidUsers').find(u => u.scenario === 'wrong password')!;

    await loginPage.clickLoginAndSwitchToTab();
    await loginPage.loginWithEmailOrUsername(user.email, user.password);
    await loginPage.validateWrongPassword();
  });

  test('LOG03 - login with valid email and password', async () => {
    expect(await loginPage.isLoginVisible()).toBeTruthy();

    const user = data.get('signin.validUser');

    await loginPage.clickLoginAndSwitchToTab();
    await loginPage.loginWithEmailOrUsername(user.email, user.password);
    await loginPage.validateLoginSuccess();
  });

  test('LOG04 - login with empty password', async () => {
    expect(await loginPage.isLoginVisible()).toBeTruthy();

    const user = data.getArray('signin.invalidUsers').find(u => u.scenario === 'empty password')!;

    await loginPage.clickLoginAndSwitchToTab();
    await loginPage.loginWithEmailOrUsername(user.email, user.password);
    await loginPage.validateEmptyPassword();
  });
});
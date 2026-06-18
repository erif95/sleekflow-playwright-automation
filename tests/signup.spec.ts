import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages';
import { DataReader } from '../utility';
import { sign } from 'crypto';

test.describe('SleekFlow Signup Flow', () => {
  let signupPage: SignupPage;
  const data = new DataReader('signupData.json');

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.open();
  });


  test('REG01 - signup with invalid format email', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'invalid email format')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.validateInvalidFormatEmail();
  });

  test('REG02 - signup with empty email', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'empty email')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.validateEmailRequired();
  });

  test('REG03 - signup without thick checkbox', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.get('signup.validUser');
    await signupPage.inputEmail(user.email);
    await signupPage.clickSignUp();
    await signupPage.validateCheckBoxNotThicked();
  });

  test('REG04 - signup with existing users', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.get('signup.existingUser');
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validateAccountExist();
  });

  test('REG05 - signup with valid users', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.get('signup.validUser');
    const email = user.email.replace('@', `.${Date.now()}@`);
    await signupPage.inputEmail(email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validateSignUpSuccess();
  });

  test('REG06 - signup with empty password', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'empty password')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.clickSignUp();
    await signupPage.validateEmptyPassword();
  });

  test('REG07 - signup with password less than minimum characters', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'less than minimum characters')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validatePasswordNotMeetCriteria();
  });

  test('REG08 - signup with password only contains lower case and number', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'password only contains lower case and number')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validatePasswordNotMeetCriteria();
  });

   test('REG09 - signup with password only contains lower case and upper case', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'password only contains lower case and upper case')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validatePasswordNotMeetCriteria();
  });

  test('REG10 - signup with password only contains lower case and special characters', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'password only contains lower case and special characters')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validatePasswordNotMeetCriteria();
  });

  test('REG11 - signup with password only contains upper case and number', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'password only contains upper case and number')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validatePasswordNotMeetCriteria();
  });

  test('REG12 - signup with password only contains upper case and special characters', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'password only contains upper case and special characters')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validatePasswordNotMeetCriteria();
  });

  test('REG13 - signup with password only contains number and special characters', async () => {
    await signupPage.clickStartedAndSwitchTab();
    expect(await signupPage.isOnSignupPage()).toBeTruthy();
    const user = data.getArray('signup.invalidUsers').find(u => u.scenario === 'password only contains number and special characters')!;
    await signupPage.inputEmail(user.email);
    await signupPage.agreeToTerms();
    await signupPage.clickSignUp();
    await signupPage.inputPassword(user.password);
    await signupPage.clickSignUp();
    await signupPage.validatePasswordNotMeetCriteria();
  });
});

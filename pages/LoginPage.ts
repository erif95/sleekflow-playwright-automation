import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';


export class LoginPage extends BasePage {

  constructor(page: Page) {
    super(page, 'signin.properties');
  }

  async open(): Promise<void> {
    await this.navigate('https://sleekflow.io/');
  }

  async clickLoginText() : Promise<void> {
    await this.click('loginText');
  }

  async isLoginVisible(): Promise<boolean> {
    return this.isVisible('loginText');
  }

  async clickLoginAndSwitchToTab(): Promise<void> {
    await this.clickAndSwitchTab('loginText');
  }

  async loginWithEmailOrUsername(email: string, password: string): Promise<void> {
    await this.waitForVisible('buttonContinue');
    await this.fill('usernameField', email);
    await this.click('buttonContinue');
    await this.fill('passwordField', password);
    await this.click('buttonSignIn');
  }

  async loginWithEmpyData(): Promise<void> {
      await this.waitForVisible('buttonContinue');
      await this.click('buttonContinue');
  }

  async validateRequiredErrMessage(): Promise<boolean> {
    return this.isVisible('errorMessageRequired');
  }

  async validateWrongPassword(): Promise<boolean> {
    return this.isVisible('errorMessageWrongPassword');
  }

  async validateLoginSuccess(): Promise<boolean> {
    return this.isVisible('settingMenuDashboard');
  }

  async validateEmptyPassword(): Promise<Boolean> {
    return this.isVisible('errorMessageEmptyPassword');
  }
}
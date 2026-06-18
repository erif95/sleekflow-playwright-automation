import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { BlobOptions } from 'buffer';

export class SignupPage extends BasePage {

  constructor(page: Page) {
    super(page, 'signup.properties', 'signin.properties');
  }

  async open(): Promise<void> {
    await this.navigate('https://sleekflow.io/');
  }


  async clickStartedAndSwitchTab(): Promise<void> {
    await this.clickAndSwitchTab('startForFreeLink');
  }

  async inputEmail(email: string): Promise<void> {
    await this.fill('emailField', email);
    
  }

  async inputPassword(password: string): Promise<void> {
    await this.focus('passwordField');
    await this.type('passwordField', password);
    await this.waitForVisible('passwordSecurityText');
  }


  async agreeToTerms(): Promise<void> {
    await this.check('cbTermsOfService');
  }

  async clickSignUp(): Promise<void> {
    await this.click('buttonSignup');
  }

  // ── Assertions / state ─────────────────────────────────────────────────────

  async isOnSignupPage(): Promise<boolean> {
    return this.isVisible('emailField');
  }

  async validateInvalidFormatEmail(): Promise<boolean> {
    return this.isVisible('errorInvalidFormatEmail');
  }

  async validateCheckBoxNotThicked(): Promise<boolean> {
    return this.isVisible('errorMessageCbRequired');
  }

  async validateEmailRequired(): Promise<boolean> {
    return this.isVisible('errorSignUpEmailRequired');
  }

  async validateAccountExist(): Promise<boolean> {
    return this.isVisible('errorMessageAccountExist');
  }

  async validateSignUpSuccess(): Promise<boolean> {
    return this.isVisible('confirmEmailText');
  }

  async validatePasswordNotMeetCriteria(): Promise<boolean> {
    return this.isVisible('errorMessagePasswordValidation');
  }

  async validateEmptyPassword(): Promise<boolean> {
    return this.isVisible('errorMessagePasswordValidation');
  }
}

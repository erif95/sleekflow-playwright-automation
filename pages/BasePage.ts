import { Page, Locator } from '@playwright/test';
import { LocatorReader } from '../utility';

export class BasePage {
  protected page: Page;
  protected readonly locators: LocatorReader;

  constructor(page: Page, ...locatorFiles: string[]) {
    this.page = page;
    this.locators = new LocatorReader(...locatorFiles);
  }

  // ── Locator shortcuts ──────────────────────────────────────────────────────

  /** First match for a locator key. */
  protected $(key: string): Locator {
    return this.locators.getLocator(this.page, key).first();
  }

  /** All matches for a locator key. */
  protected $$(key: string): Locator {
    return this.locators.getLocator(this.page, key);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  // ── Waits ──────────────────────────────────────────────────────────────────

  async waitForVisible(key: string, timeout = 15000): Promise<void> {
    await this.$(key).waitFor({ state: 'visible', timeout });
  }


  async isVisible(key: string, timeout = 8000): Promise<boolean> {
    try {
      await this.$(key).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isLocatorVisible(locator: Locator, timeout = 8000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async click(key: string): Promise<void> {
    await this.waitForVisible(key);
    await this.$(key).click();
  }

  async check(key: string): Promise<void> {
    await this.waitForVisible(key);
    await this.$(key).check({ force: true });
  }

  async fill(key: string, value: string): Promise<void> {
    await this.waitForVisible(key);
    await this.$(key).clear();
    await this.$(key).fill(value);
  }

  async focus(key: string, timeout = 15000): Promise<void> {
    await this.waitForVisible(key, timeout);
    await this.$(key).focus();
  }

  async type(key: string, value: string): Promise<void> {
    await this.waitForVisible(key);
    await this.$(key).clear();
    await this.$(key).pressSequentially(value);
  }

  async selectOption(key: string, value: string): Promise<void> {
    await this.waitForVisible(key);
    await this.$(key).selectOption(value);
  }

  async getText(key: string): Promise<string> {
    await this.waitForVisible(key);
    return this.$(key).innerText();
  }

  async hover(key: string): Promise<void> {
    await this.waitForVisible(key);
    await this.$(key).hover();
  }

  async scrollTo(key: string): Promise<void> {
    await this.$(key).scrollIntoViewIfNeeded();
  }

  // ── Page context ───────────────────────────────────────────────────────────

  getUrl(): string {
    return this.page.url();
  }

  async clickAndSwitchTab(key: string): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.$(key).click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    this.page = newPage;
    return newPage;
  }

  async switchToNewTab(): Promise<Page> {
    const newPage = await this.page.context().waitForEvent('page');
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  async delay(): Promise<void> {

      await this.page.waitForTimeout(9000);
 }
}

import * as fs from 'fs';
import * as path from 'path';
import { Page, Locator } from '@playwright/test';

type LocatorStrategy = 'css' | 'xpath' | 'id' | 'role' | 'text' | 'testid' | 'placeholder' | 'label';

/**
 * Reads element selectors from .properties files (key=strategy=selector format).
 * Multiple files can be loaded; later files override duplicate keys.
 */
export class LocatorReader {
  private readonly map: Map<string, string>;

  constructor(...fileNames: string[]) {
    this.map = new Map();
    for (const fileName of fileNames) {
      this.load(fileName);
    }
  }


  private load(fileName: string): void {
    const filePath = path.resolve(__dirname, '..', 'locators', fileName);
    if (!fs.existsSync(filePath)) throw new Error(`Locator file not found: ${filePath}`);

    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const sep = line.indexOf('=');
      if (sep < 1) continue;
      const key = line.slice(0, sep).trim();
      const value = line.slice(sep + 1).trim();
      this.map.set(key, value);
    }
  }

  private rawOf(key: string): string {
    const value = this.map.get(key);
    if (value === undefined) throw new Error(`Locator key not found: "${key}"`);
    return value;
  }

  
  get(key: string): string {
    return this.rawOf(key);
  }

  getLocator(page: Page, key: string): Locator {
    const raw = this.rawOf(key);
    const colonAt = raw.indexOf('=');
    if (colonAt < 1) return this.autoDetect(page, raw);

    const strategy = raw.slice(0, colonAt).toLowerCase() as LocatorStrategy;
    const value = raw.slice(colonAt + 1);

    switch (strategy) {
      case 'css':         return page.locator(value);
      case 'xpath':       return page.locator(value);
      case 'id':          return page.locator(`#${value}`);
      case 'text':        return page.getByText(value, { exact: false });
      case 'testid':      return page.getByTestId(value);
      case 'placeholder': return page.getByPlaceholder(value);
      case 'label':       return page.getByLabel(value);
      case 'role':        return this.roleLocator(page, value);
      default:            return this.autoDetect(page, raw);
    }
  }

  

  private autoDetect(page: Page, raw: string): Locator {
    return raw.startsWith('//') ? page.locator(raw) : page.locator(raw);
  }

  /**
   * Parses: button[name="Submit"]  or  button[name="Submit" exact=true]
   */
  private roleLocator(page: Page, value: string): Locator {
    const bracketAt = value.indexOf('[');
    const role = (bracketAt < 0 ? value : value.slice(0, bracketAt)).trim();
    const opts: Record<string, any> = {};

    if (bracketAt >= 0) {
      const attrs = value.slice(bracketAt + 1, value.lastIndexOf(']'));
      // Match key="value" or key=true/false
      const attrRe = /(\w+)=(?:"([^"]*)"|(true|false))/g;
      let m: RegExpExecArray | null;
      while ((m = attrRe.exec(attrs)) !== null) {
        const [, k, doubleQ, singleQ, boolVal, unquoted] = m;
        if (boolVal !== undefined)       opts[k] = boolVal === 'true';
        else if (doubleQ !== undefined)  opts[k] = doubleQ;
        else if (singleQ !== undefined)  opts[k] = singleQ;
        else if (unquoted !== undefined) opts[k] = unquoted.trim();
      }
    }

    return page.getByRole(role as any, opts);
  }
}

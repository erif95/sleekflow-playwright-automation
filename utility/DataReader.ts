import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads structured test data from a JSON file in /testdata/.
 * Supports dot-notation key traversal: get('signup.validUser.email')
 */
export class DataReader {
  private readonly data: Record<string, any>;

  constructor(fileName: string) {
    const filePath = path.resolve(__dirname, '..', 'testdata', fileName);
    if (!fs.existsSync(filePath)) throw new Error(`Test data file not found: ${filePath}`);
    this.data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  /**
   * Retrieves a value by dot-notation key.
   * Throws if the key path doesn't exist.
   */
  get<T = any>(key: string): T {
    const value = key.split('.').reduce<any>((obj, k) => obj?.[k], this.data);
    if (value === undefined) throw new Error(`DataReader: key not found → "${key}"`);
    return value as T;
  }

  /** Convenience aliases */
  getString(key: string): string   { return this.get<string>(key); }
  getNumber(key: string): number   { return this.get<number>(key); }
  getBoolean(key: string): boolean { return this.get<boolean>(key); }
  getArray<T = any>(key: string): T[] { return this.get<T[]>(key); }
}

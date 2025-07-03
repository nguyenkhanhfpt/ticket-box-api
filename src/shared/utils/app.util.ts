import * as bcrypt from 'bcrypt';
import { I18nContext, TranslateOptions } from 'nestjs-i18n';

export const hashPassword = async (password: string): Promise<string> => {
  const saltOrRounds = 10;

  return await bcrypt.hash(password, saltOrRounds);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Translate.
 * @param key
 * @param options
 */
export const t = (key: string, options?: TranslateOptions): string => {
  return I18nContext.current()?.t(key, options) || key;
};

import { basicValidation, Check, Coerce, CommonValidationOptions, Convert, createAsCheck, createIsCheck, createMaybeAsCheck, createMaybeCheck, Validate } from './common';
import { Issue } from './types';

interface CoerceOptions {
  setProtocol?: string;
}

interface ValidationOptions extends CommonValidationOptions<URL> {
  protocol?: string;
}

const check: Check<URL> = (value): value is URL => {
  return value instanceof URL;
};

const convert: Convert<URL> = (value) => {
  if (typeof value === 'string') {
    try {
      return new URL(value);
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
};

const coerce: Coerce<URL, CoerceOptions> = (options) => (next) => (value) => {
  if (!options) return next(value);

  const coerced = new URL(value.toString());
  if (options.setProtocol) {
    coerced.protocol = options.setProtocol;
  }
  return next(coerced);
};

const validate: Validate<URL, ValidationOptions> = (value, options) => {
  const result = basicValidation(value, options);
  if (options.protocol && value.protocol.replace(/:\s*$/, '') !== options.protocol.replace(/:\s*$/, '')) {
    result.issues.push(Issue.from(value, 'invalid-protocol', { expectedProtocol: options.protocol }));
  }
  return result;
};

export const isUrl = createIsCheck('url', check, coerce, validate);
export const maybeUrl = createMaybeCheck('url', check, coerce, validate);
export const asUrl = createAsCheck('url', check, convert, coerce, validate);
export const maybeAsUrl = createMaybeAsCheck('url', check, convert, coerce, validate);

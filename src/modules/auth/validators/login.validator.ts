import * as Joi from 'joi';
import { BaseValidator } from '@common/validators';

export const LoginValidator = BaseValidator.keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required(),
});

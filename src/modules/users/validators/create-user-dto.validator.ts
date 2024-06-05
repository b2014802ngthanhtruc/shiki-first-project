import { BaseValidator } from '@common/validators';
import * as joi from 'joi';

export const CreateUserValidator = BaseValidator.keys({
  email: joi.string().email().trim().required(),
  password: joi.string().trim().required(),
  firstName: joi.string().trim().min(2).required(),
  lastName: joi.string().trim().min(2).required(),
  adminStatus: joi.string().trim().allow('').required(),
  userStatus: joi.string().trim().allow('').required(),
  isAdmin: joi.boolean().required(),
  isUser: joi.boolean().required(),
});

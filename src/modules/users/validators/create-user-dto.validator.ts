import * as joi from 'joi';

import { BaseValidator } from '@common/validators';

export const CreateUserValidator = BaseValidator.keys({
  email: joi.string().email().trim().required(),
  password: joi.string().trim().required(),
  firstName: joi.string().trim().min(2).required(),
  lastName: joi.string().trim().min(2).required(),
  adminStatus: joi.string().trim().allow('').required(),
  userStatus: joi.string().trim().allow('').required(),
  salerStatus: joi.string().trim().allow('').required(),
  isAdmin: joi.boolean().required(),
  isUser: joi.boolean().required(),
  isSaler: joi.boolean().required(),
});

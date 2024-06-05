import { BaseValidator } from '@common/validators';
import * as joi from 'joi';

export const UpdateUserValidator = BaseValidator.keys({
  email: joi.string().email().trim().required(),
  firstName: joi.string().trim().min(2).required(),
  lastName: joi.string().trim().min(2).required(),
  adminStatus: joi.string().allow(''),
  usersStatus: joi.string().allow(''),
  isAdmin: joi.boolean().required(),
  isUser: joi.boolean().required(),
});

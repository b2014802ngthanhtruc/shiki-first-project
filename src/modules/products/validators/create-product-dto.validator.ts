import * as joi from 'joi';

import { BaseValidator } from '@common/validators';

export const CreateProductDtoValidator = BaseValidator.keys({
  name: joi.string().trim().required(),
  price: joi.number().min(1).required(),
  quantity: joi.number().min(1).required(),
  description: joi.string().trim().required(),
  categoryId: joi.string().id().trim().required(),
});

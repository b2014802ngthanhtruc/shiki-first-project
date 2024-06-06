import * as joi from 'joi';

import { BaseValidator } from '@common/validators';

export const UpdateProductDtoValidator = BaseValidator.keys({
  name: joi.string().trim(),
  price: joi.number().min(1),
  quantity: joi.number().min(1),
  description: joi.string().trim(),
  categoryId: joi.string().id().trim(),
  updateAt: joi.date().default(() => new Date()),
});

import * as joi from 'joi';

import { BaseValidator } from '@common/validators';

export const UpdateCategoryDtoValidator = BaseValidator.keys({
  name: joi.string().trim().required(),
  updateAt: joi.date().default(() => new Date()),
});
